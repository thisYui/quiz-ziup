class Quiz::Question::FillInController < ApplicationController
  def add_result
    result = FillResult.new(question_id: params[:question_id])
    return unless is_true(result.save)

    render json: { status: "success", message: "Result added successfully", result_id: result.id }, status: :ok
  end

  def remove_result
    result = FillResult.find_by(id: params[:result_id], question_id: params[:question_id])
    return unless is_true(result&.destroy)

    render json: { status: "success", message: "Result removed successfully" }, status: :ok
  end
end