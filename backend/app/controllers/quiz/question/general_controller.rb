class Quiz::Question::GeneralController < ApplicationController
  def update_content
    # Cập nhật nội dung câu hỏi
    # Bao gồm :
    #    Dữ liệu thuộc Question
    #    Dữ liệu thuộc Option và Result
    question_id = params[:id]
    question = Question.find_by(id: question_id)
    return unless is_true(question) and question

    # params chứa 2 phần chính
    # question: Dạng JSON, nội dung đầy đủ của 1 dòng dữ liệu question
    #     => các param present trong question sẽ được cập nhật
    question_data = params[:question]
    return unless is_true(update_question_content(question_data))

    # options: Mảng các option của question, phụ thuộc type của question
    # results: Mảng các kết quả của question
    options_data = params[:options]
    results_data = params[:results]
    type = params[:type]

    return unless is_true(QuestionUtils.update_option_and_result_of_question(question_id, type, options_data, results_data))
    render json: { message: 'Question updated successfully' }, status: :ok
  end
end