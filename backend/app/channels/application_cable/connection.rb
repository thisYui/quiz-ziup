module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_participant

    def connect
      self.current_participant = find_verified_user
      Rails.logger.info "WebSocket connected: #{current_participant.id}"
    end

    def disconnect
      # Xóa current_participant if needed
      Rails.logger.info "WebSocket disconnected: #{current_participant.id}"
    end

    private

    def find_verified_user
      participantion_id = request.params[:participantion_id]
      quiz_id = request.params[:quiz_id]

      if participantion_id.present? && quiz_id.present?
        participantion = Participation.find_by(id: participantion_id)
        if participantion
          Rails.logger.info "Verified participant: #{participantion.id}"
          return {
            id: participantion.id,
            quiz_id: quiz_id,
          }

        else
          Rails.logger.warn "Participant not found: #{participantion_id}"
          reject_unauthorized_connection
        end
      else
        Rails.logger.warn "No participant ID provided"
        reject_unauthorized_connection
      end
    end
  end
end
