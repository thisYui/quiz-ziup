class Quiz::UpdateController < ApplicationController
  def update_title
    quiz = Quiz.friendly.find(params[:quiz_id])
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
    quiz = Quiz.friendly.find(params[:quiz_id])
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
    quiz = Quiz.friendly.find(params[:quiz_id])
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

  def update_key
    quiz = Quiz.friendly.find(params[:quiz_id])
    return unless is_true(quiz) and quiz

    # Ensure only the owner can update the quiz status
    if params[:new_key].present?
      quiz.is_private = true
      quiz.key = params[:new_key]
      return unless is_true(quiz.save)
      render json: { message: 'Quiz created successfully' }, status: :ok
    else
      render json: { error: I18n.t("quiz.update.failure") }, status: :unprocessable_entity
    end
  end

  def update_topic
    quiz = Quiz.friendly.find(params[:quiz_id])
    return unless is_true(quiz) and quiz

    # Ensure only the owner can update the quiz topic
    if params[:new_topic].present?
      quiz.topic = params[:new_topic].to_i
      return unless is_true(quiz.save)
      render json: { message: 'Quiz created successfully' }, status: :ok
    else
      render json: { error: I18n.t("quiz.update.failure") }, status: :unprocessable_entity
    end
  end

  def update_max_participants
    quiz = Quiz.friendly.find(params[:quiz_id])
    return unless is_true(quiz) and quiz

    # Ensure only the owner can update the quiz max participants
    if params[:new_max_participants].present?
      max_participants = params[:new_max_participants].to_i
      if max_participants < 1
        render json: { error: I18n.t("quiz.update.failure") }, status: :unprocessable_entity
      else
        quiz.max_participants = max_participants
        return unless is_true(quiz.save)
        render json: { message: 'Quiz created successfully' }, status: :ok
      end
    else
      render json: { error: I18n.t("quiz.update.failure") }, status: :unprocessable_entity
    end
  end
end
