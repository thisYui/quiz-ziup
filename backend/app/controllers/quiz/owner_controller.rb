class OwnerController < ApplicationController
  def open
    quiz_session = QuizSession.new(quiz_id: params[:quiz_id])
    return unless is_true(quiz_session.save)
    render json: { message: 'Quiz created successfully' }, status: :ok
  end

  def start
    quiz_session = QuizSession.get_instance_session(params[:quiz_id])
    return unless is_true(quiz_session)
    quiz_session.is_ended = true

    return unless is_true(quiz_session.save)
    render json: { message: 'Quiz ended successfully' }, status: :ok
  end

  def show_result

  end

  def next

  end
end