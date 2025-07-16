class Account::GettingController < ApplicationController
  def information
    user = find_user(params[:user_id])
    return unless user

    _user = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      avatar_url: FileService.get_file_url(user.avatar_url)
    }

    render json: _user, status: :ok
  end

  def owner_quiz
    id = params[:id]
    quizzes = Quiz.where(user_id: id)

    quizzes.map do |q|
      {
        id: q.id,
        name: q.name,
        code: q.code,
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
      SqlHelper.get_top_quiz_topic
    end
  end
end
