class Quiz::Question::GeneralController < ApplicationController
  def update
    # Cập nhật nội dung câu hỏi
    # Bao gồm :
    #    Dữ liệu thuộc Question
    #    Dữ liệu thuộc Option và Result
    question_id = params[:question_id]
    question = Question.find_by(id: question_id)
    return unless is_true(question) and question

    # params chứa 4 phần: question, options, results, type
    # question: Dạng JSON, nội dung đầy đủ của 1 dòng dữ liệu question
    #     => các param present trong question sẽ được cập nhật
    question_data = params[:question]
    return unless is_true(QuestionUtils.update_question_content(question_data))

    # options: Mảng các option của question, phụ thuộc type của question
    # results: Mảng các kết quả của question
    options_data = params[:options]
    results_data = params[:results]
    type = params[:type]

    return unless is_true(QuestionUtils.update_option_and_result_of_question(question_id, type, options_data, results_data))
    render json: { message: 'Question updated successfully' }, status: :ok
  end

  def change_type
    question = Question.find_by(id: params[:question_id])

    unless is_true(question) && question
      render json: { message: 'Question not found or unauthorized' }, status: :unprocessable_entity
      return
    end

    new_question = nil
    error_message = nil

    ActiveRecord::Base.transaction do
      unless question.destroy
        error_message = "Failed to delete old question"
        raise ActiveRecord::Rollback
      end

      new_question = Question.new(
        content: '',
        question_type: params[:type],
        quiz_id: question.quiz_id,
        time: 30,
        score: 1,
        position: question.position
      )

      unless new_question.save
        error_message = "Failed to create new question"
        raise ActiveRecord::Rollback
      end
    end

    if new_question&.persisted?
      render json: { question_id: new_question.id }, status: :ok
    else
      render json: { message: error_message || "Unknown error" }, status: :unprocessable_entity
    end
  rescue => e
    render json: { message: e.message }, status: :unprocessable_entity
  end
end