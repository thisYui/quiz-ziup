class Quiz::StartController < ApplicationController
  def start
    quiz = Quiz.find_by(id: params[:id])

    if quiz.nil?
      render json: { error: I18n.t('quiz.start.not_found') }, status: :not_found
      return
    end

    quiz.can_register = true
    quiz.save

    render json: quiz , status: :ok
  end

  def end
    quiz = Quiz.find_by(id: params[:id])

    if quiz.nil?
      render json: { error: I18n.t('quiz.end.not_found') }, status: :not_found
      return
    end

    quiz.can_register = false
    quiz.save

    render json: { message: I18n.t('quiz.end.success') }, status: :ok
  end
end
