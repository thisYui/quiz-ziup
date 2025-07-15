class Quiz::JoinController < ApplicationController
  def join
    quiz = find_quiz(params[:code], params[:key])
    return unless quiz

    quiz_session = get_instance_session(quiz.id)
    return unless quiz_session

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

  private

  def find_quiz(code, key = nil)
    quiz = Quiz.find_by(code: code)

    unless quiz
      render json: { error: I18n.t('quiz.join.not_found') }, status: :not_found
      return nil
    end

    if quiz.status == "key"
      if key.nil?
        render json: { key: true }, status: :ok
        return nil
      end

      if quiz.key != key
        render json: { error: I18n.t('quiz.join.invalid_key') }, status: :unprocessable_entity
        return nil
      end
    end

    quiz
  end

  def get_instance_session(quiz_id)
    quiz_session = QuizSession.where(quiz_id: quiz_id).order(updated_at: :desc).first

    if quiz_session.nil? || quiz_session.is_ended
      render json: { error: I18n.t('quiz.join.not_started') }, status: :not_found
      return nil
    end

    quiz_session
  end
end
