class Quiz::ViewController < ApplicationController
  def show
    # Lấy danh sách người tham gia quiz tại mỗi session
    # Trả về session của quiz hiện tại và dữ liệu tại sesion đó
    # Bao gồm trong mỗi session:
    #   Danh sách người dùng
    #   Người dùng phải có tên, avatar, điểm
    #   Có xếp hạng
    #   Có thống kê số câu đúng cảu mỗi người

    all_sessions = QuizSession.get_all_quiz_sessions(params[:quiz_id])
    if all_sessions.empty?
      render json: { all_sessions: all_sessions, info_quiz_session: nil }, status: :ok
      return
    end

    first_session = all_sessions.first

    # Chỉ lấy session đầu tiên cho view
    # Người dùng có thể lấy thêm các session khác nếu cần
    info_quiz_session = QuizSession.get_information_quiz_session(first_session.id)
    render json: { all_sessions: all_sessions, info_quiz_session: info_quiz_session }, status: :ok
  end

  def get_content_quiz
    # Lấy nội dung của quiz
    # Trả về danh sách các câu hỏi và thông tin quiz

    quiz_id = params[:quiz_id]
    quiz = Quiz.find_by(id: quiz_id)
    return unless quiz and is_true(quiz)

    quiz_content = quiz.get_content
    return unless is_true(quiz_content)

    render json: { quiz_content: quiz_content }, status: :ok
  end

  def info_session
    # Lấy thông tin của một quiz session cụ thể
    # Tương tự như show nhưng chỉ lấy thông tin của một session

    quiz_session_id = params[:quiz_session_id]
    info_quiz_session = QuizSession.get_information_quiz_session(quiz_session_id)
    return unless is_true(info_quiz_session)

    render json: { info_quiz_session: info_quiz_session }, status: :ok
  end

  def statistical

  end
end
