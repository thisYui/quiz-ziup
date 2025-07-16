class QuizChannel < ApplicationCable::Channel
  def subscribed
    quiz_id = params[:quiz_id]

    # Add user to the quiz participants list
    QuizListener.add_participant(quiz_id, current_user.id)

    # Stream from the quiz channel
    stream_from "quiz_#{quiz_id}"

    # Send current participant count to the new subscriber
    transmit({
      event: 'participant_count',
      count: QuizListener.get_participant_count(quiz_id)
    })
  end

  def unsubscribed
    quiz_id = params[:quiz_id]

    # Remove user from the quiz participants list
    QuizListener.remove_participant(quiz_id, current_user.id)

    # Broadcast updated participant count
    ActionCable.server.broadcast("quiz_#{quiz_id}", {
      event: 'participant_count',
      count: QuizListener.get_participant_count(quiz_id)
    })
  end

  # Client can request the list of participants
  def request_participants
    quiz_id = params[:quiz_id]

    # Get the list of participants
    participants = QuizListener.get_participants(quiz_id)

    # Send the list to the requesting client
    transmit({
      event: 'participants_list',
      participants: participants,
      count: participants.size
    })
  end
end
