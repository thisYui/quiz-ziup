class Quiz::CreateController < ApplicationController
  def create
    quiz = Quiz.new(
      owner_user_id: params[:owner_user_id],
      code: params[:code],
      description: params[:description],
      title: params[:title],
      status: params[:status],
      max_participants: params[:max_participants],
      topic: params[:topic],
      key: params[:key],
      can_register: false
    )

    if quiz.save
      render json: { message: 'Quiz created successfully', quiz_id: quiz.id }, status: :created
    else
      render json: { errors: quiz.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def delete
    quiz = Quiz.find(params[:quiz_id])

    # Ensure only the owner can delete the quiz
    # Các question thuộc quiz sẽ được xoá theo cascade
    if quiz.owner_user_id.to_s == params[:user_id].to_s
      quiz.destroy
      render json: { message: 'Quiz deleted successfully' }, status: :ok
    else
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def add_question
    # Lưu question vào table
    question = Question.new(params[:question])
    question.save

    # API này sẽ không quan tâm loại question
    # Mặc định ban đầu sẽ không có bất kì answer hay option nào

    render json: { message: 'Question added successfully' }, status: :ok
  end

  def remove_question
    # Các option và answer được xóa theo delete cascade
    # Chỉ cần xóa question khỏi table các question phụ thuộc sẽ được xóa
    question = Question.find(params[:question_id])
    question.destroy

    render json: { message: 'Question removed successfully' }, status: :ok
  end

  def complete_quiz
    quiz = Quiz.find(params[:quiz_id])

    # Ensure only the owner can complete the quiz
    if quiz.owner_user_id.to_s == current_user.id.to_s
      quiz.update(status: 'completed')

      # Remove the quiz from the active quizzes list
      QuizListener.remove_quiz(quiz.id)

      render json: { message: 'Quiz completed successfully' }, status: :ok
    else
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
end
