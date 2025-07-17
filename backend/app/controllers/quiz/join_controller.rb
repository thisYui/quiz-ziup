class Quiz::JoinController < ApplicationController
  def join
    result = Quiz.find_quiz_by_code_and_key(params[:code], params[:key])

    if result.nil?
      render json: { error: 'Quiz not found' }, status: :not_found
      return
    elsif result == "no-key"
      render json: { error: 'Quiz is private, key is required' }, status: :forbidden
      return
    elsif result == "invalid-key"
      render json: { error: 'Invalid key for the quiz' }, status: :forbidden
      return
    end

    quiz = result
    quiz_session = QuizSession.get_instance_session(quiz.id)
    return unless is_true(quiz_session)

    quiz_session.join(params[:participator_id], params[:participator_type])  # Join và ghi nhận tham gia
    participants = quiz_session.get_list_participants

    render json: {
      quiz_session: quiz_session,
      participants: participants
    }, status: :ok
  end

  def submit
    # chưa viết
  end

  def start
    quiz_session = QuizSession.new(quiz_id: params[:quiz_id])
    return unless is_true(quiz_session.save)
    render json: { message: 'Quiz created successfully' }, status: :ok
  end

  def end
    quiz_session = QuizSession.get_instance_session(params[:quiz_id])
    return unless is_true(quiz_session)
    quiz_session.is_ended = true

    return unless is_true(quiz_session.save)
    render json: { message: 'Quiz ended successfully' }, status: :ok
  end
end
