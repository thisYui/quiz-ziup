class QuizChannel < ApplicationCable::Channel
  def subscribed
    quiz_id = params[:quiz_id]
    Rails.logger.info "Subscribed to QuizChannel - quiz_id: #{quiz_id} - socket: #{connection.connection_identifier}"
    stream_from "quiz_#{quiz_id}"
  end

  def unsubscribed
    # Cleanup if needed
  end

  def receive(data)
    # Nếu client gửi message mà không gọi method cụ thể
  end
end
