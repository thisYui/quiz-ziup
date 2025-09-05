class QuizChannel < ApplicationCable::Channel
  def subscribed
    @quiz_id = connection.current_participant[:quiz_id]
    @id = connection.current_participant[:id]

    Rails.logger.info "Subscribed to QuizChannel - quiz_id: #{quiz_id} - socket: #{connection.connection_identifier}"
    stream_from "quiz_#{@quiz_id}"
  end

  def unsubscribed
    # Gửi thông báo đến các client còn lại
    # Xóa đi người tham gia đã rời khỏi quiz
    Rails.logger.info "Unsubscribed: participant #{@id} from quiz #{@quiz_id}"
    SocketNotifier.one_player_left(@id, @quiz_id)
  end

  def receive(data)
    #
  end
end
