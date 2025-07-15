class Quiz::StartController < ApplicationController
  def start
    quiz = Quiz.find_by(id: params[:id])

    if quiz.nil?
      render json: { error: I18n.t('quiz.start.not_found') }, status: :not_found
      return
    end

    quiz_session = QuizSession.new(quiz_id: quiz.id)
    quiz_session.save

    render json: quiz , status: :ok
  end

  def end
    quiz_session = QuizSession.where(id: params[:id]).order(created_at: :desc).first
    quiz_session.is_ended = true
    quiz_session.save

    render json: { message: I18n.t('quiz.end.success') }, status: :ok
  end
end
