class Quiz::Question::ChoiceController < ApplicationController
  def add_option
    option = ChoiceOption.new(
      question_id: params[:id],
      content: params[:content],
      is_correct: false,
      position: params[:position]
    )

    return unless is_true(option.save)
    render json: { message: 'Option added successfully', option_id: option.id }, status: :ok
  end

  def remove_option
    option = ChoiceOption.find_by(id: params[:option_id], question_id: params[:id])
    return unless option and is_true(option.remove_option)

    render json: { message: 'Option removed successfully' }, status: :ok
  end

  def choice_result
    result = ChoiceOption.find_by(id: params[:option_id], question_id: params[:id])
    return unless result and is_true(result.update(is_correct: true))

    render json: { result: result }, status: :ok
  end
end