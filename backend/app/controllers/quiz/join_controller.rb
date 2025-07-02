class Quiz::JoinController < ApplicationController
  def join
    quiz = Quiz.find_by(code: params[:code])

    if quiz.nil?
      render json: { error: I18n.t('quiz.join.not_found') }, status: :not_found
      return
    end

    if quiz.key
      render json: { key: true }, status: :ok
      return
    end

    unless quiz.can_register
      render json: { error: I18n.t('quiz.join.not_started') }, status: :forbidden
      return
    end

    if quiz.count_register >= quiz.max_participants
      render json: { error: I18n.t('quiz.join.full') }, status: :forbidden
      return
    end

    # ---------

    render json: { message: I18n.t('quiz.join.success') }, status: :ok
  end

  def join_with_key

  end

  def submit

  end
end
