class Quiz::UpdateController < ApplicationController
  def update_name
    quiz = Quiz.where(id: params[:quiz_id], owner_user_id: params[:user_id])
    return unless is_true(quiz) and quiz

    # Ensure only the owner can update the quiz name
    if params[:new_title].present?
      quiz.title = params[:new_title]
      return unless is_true(quiz.save)
      render json: { message: 'Quiz created successfully' }, status: :ok
    else
      render json: { error: I18n.t("quiz.update.failure") }, status: :unprocessable_entity
    end
  end

  def update_description
    quiz = Quiz.where(id: params[:quiz_id], owner_user_id: params[:user_id])
    return unless is_true(quiz) and quiz

    # Ensure only the owner can update the quiz name
    if params[:new_description].present?
      quiz.description = params[:new_description]
      return unless is_true(quiz.save)
      render json: { message: 'Quiz created successfully' }, status: :ok
    else
      render json: { error: I18n.t("quiz.update.failure") }, status: :unprocessable_entity
    end
  end

  def update_code
    quiz = Quiz.where(id: params[:quiz_id], owner_user_id: params[:user_id])
    return unless is_true(quiz) and quiz

    # Ensure only the owner can update the quiz code
    if params[:new_code].present?
      if Quiz.exists?(code: params[:new_code])
        render json: { error: I18n.t("quiz.update.code_exists") }, status: :unprocessable_entity
      else
        quiz.code = params[:new_code]
        return unless is_true(quiz.save)
        render json: { message: 'Quiz created successfully' }, status: :ok
      end
    else
      render json: { error: I18n.t("quiz.update.failure") }, status: :unprocessable_entity
    end
  end

  def update_is_private
    quiz = Quiz.where(id: params[:quiz_id], owner_user_id: params[:user_id])
    return unless is_true(quiz) and quiz

    # Ensure only the owner can update the quiz status
    if params[:new_is_private].present?
      quiz.is_private = params[:new_is_private]
      return unless is_true(quiz.save)
      render json: { message: 'Quiz created successfully' }, status: :ok
    else
      render json: { error: I18n.t("quiz.update.failure") }, status: :unprocessable_entity
    end
  end

  def update_topic
    quiz = Quiz.where(id: params[:quiz_id], owner_user_id: params[:user_id])
    return unless is_true(quiz) and quiz

    # Ensure only the owner can update the quiz topic
    if params[:new_topic].present?
      quiz.topic = params[:new_topic]
      return unless is_true(quiz.save)
      render json: { message: 'Quiz created successfully' }, status: :ok
    else
      render json: { error: I18n.t("quiz.update.failure") }, status: :unprocessable_entity
    end
  end
end
