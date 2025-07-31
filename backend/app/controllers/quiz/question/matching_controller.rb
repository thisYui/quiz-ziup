class Quiz::Question::MatchingController < ApplicationController
  def add_option
    option = MatchingOption.new(
      question_id: params[:question_id],
      side: params[:side],
      position: params[:position],
      content: ""
    )

    return unless is_true(option.save)
    render json: { message: 'Option added successfully', option_id: option.id }, status: :ok
  end

  def remove_option
    option = MatchingOption.find_by(id: params[:option_id], question_id: params[:question_id])

    return unless option and is_true(option.remove_option)
    render json: { message: 'Option removed successfully' }, status: :ok
  end

  def add_result
    result = MatchingResult.new(
      question_id: params[:question_id],
      option_left_id: params[:option_left_id],
      option_right_id: params[:option_right_id]
    )

    return unless is_true(result.save)
    render json: { message: 'Result added successfully', result_id: result.id }, status: :ok
  end

  def remove_result
    result = MatchingResult.find_by(id: params[:result_id], question_id: params[:question_id])

    return unless result and is_true(result.destroy)
    render json: { message: 'Result removed successfully' }, status: :ok
  end
end