class Quiz::OwnersController < ApplicationController
  def open
    quiz_session = QuizSession.new(quiz_id: params[:quiz_id])
    return unless is_true(quiz_session.save)
    render json: { message: 'Quiz created successfully' }, status: :ok
  end

  def start
    # Lệnh đến server để bắt đầu quiz
    # Các socket sẽ nhận được thông báo bắt đầu và lấy dữ liệu
    quiz_id = params[:quiz_id]
    SocketNotifier.start_quiz(quiz_id)
    render json: { message: 'Quiz started successfully' }, status: :ok
  end

  def show_result_question
    # Hiển thị kết quả câu hỏi hiện tại
    quiz_id = params[:quiz_id]
    data = StorageAnswer.get_answer_storage(quiz_id)
    SocketNotifier.result_and_rating(quiz_id, data)
    render json: { message: 'Result and rating' }, status: :ok
  end

  def next
    # Chuyển sang câu hỏi tiếp theo
    quiz_id = params[:quiz_id]
    SocketNotifier.next_question(quiz_id)
    render json: { message: 'Next question' }, status: :ok
  end

  def final
    quiz_id = params[:quiz_id]
    SocketNotifier.next_question(quiz_id)
    render json: { message: 'Next question' }, status: :ok
  end
end