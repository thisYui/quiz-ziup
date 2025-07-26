class Quiz::CreateController < ApplicationController
  def create
    quiz = Quiz.create(params)
    if quiz.nil?
      render json: { error: "Quiz is exists" }, status: :unprocessable_entity
      return
    end
    render json: { quiz_id: quiz.id, quiz_slug: quiz.slug }, status: :ok
  end

  def delete
    quiz = Quiz.friendly.find(params[:quiz_id])
    return unless is_true(quiz) and quiz

    # Ensure only the owner can delete the quiz
    # Các question thuộc quiz sẽ được xoá theo cascade
    if quiz.destroy
      render json: { message: 'Quiz deleted successfully' }, status: :ok
    else
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def add_question
    # Lưu question vào table
    question = Question.new(params)

    # API này sẽ không quan tâm loại question
    # Mặc định ban đầu sẽ không có bất kì answer hay option nào
    # Việc cập nhật cho mỗi loại sẽ cho api khác phụ trách
    return unless is_true(question.save)
    render json: { question_id: question.id }, status: :ok
  end

  def remove_question
    # Các option và answer được xóa theo delete cascade
    # Chỉ cần xóa question khỏi table các question phụ thuộc sẽ được xóa
    # Đẩy tất cả cấu hỏi position lùi lại phần câu hỏi trước đó
    if Question.remove_with_condition(params[:question_id])
      render json: { message: 'Question removed successfully' }, status: :ok
    else
      render json: { error: 'Failed to remove question', details: question.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
