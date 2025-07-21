class Account::GettingController < ApplicationController
  def information
    user = User.find_by(id: params[:user_id])
    return unless is_true(user) and user

    _user = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      avatar_url: FileService.get_file_url(user.avatar_url)
    }

    render json: _user, status: :ok
  end

  def owner_quiz
    quizzes = Quiz.where(owner_user_id: params[:user_id])

    quizzes.map do |q|
      {
        id: q.id,
        name: q.name,
        code: q.code,
        slug: q.slug,
        description: q.description
      }
    end
  end

  def quiz_outstanding
    # Lấy dữ lệu từ cache
    # Dữ liệu lưu trữ trong cache sẽ được cập nhật mỗi 12 giờ
    # Trong vòng 10s sau khi cache hết hạn, chỉ 1 request được phép truy vấn
    # Các request khác sẽ chờ hoặc dùng cache cũ tạm thời.
    Rails.cache.fetch('top_quiz_topic', expires_in: 12.hours, race_condition_ttl: 10.seconds) do
      SqlQuery.get_top_quiz_topic
    end
  end

  def history
    # Tìm tất cả quiz đã tham gia của người dùng
    # Có điểm và các câu đúng sai, đáp án và câu trả lời
    # api này chỉ show các quiz đã tham gia, chi tiết ấn vào quiz sẽ có api khác
    user_id = params[:user_id]
    quiz_info = User.get_quiz_information(user_id)
    render json: quiz_info, status: :ok
  end

  def show_quiz
    # Có điểm và các câu đúng sai, đáp án và câu trả lời
    quiz_session_id = params[:quiz_session_id]
    participator_id = params[:participator_id]
    info = Quiz.get_quiz_info(quiz_session_id, participator_id)
    render json: info, status: :ok
  end
end
