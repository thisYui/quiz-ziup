class Quiz::JoinController < ApplicationController
  def join
    quiz = Quiz.find_quiz_by_code_and_key(params[:code], params[:key])

    error =
      if quiz.nil?
        ['Quiz not found', :not_found]
      elsif quiz == Quiz::KEY[:NOT]
        ['Quiz is private, key is required', :forbidden]
      elsif quiz == Quiz::KEY[:INVALID]
        ['Invalid key for the quiz', :forbidden]
      end

    if error
      render json: { error: error[0] }, status: error[1]
      return
    end

    quiz_session = QuizSession.get_instance_session(quiz.id)
    return head(:bad_request) unless is_true(quiz_session)

    participator_id = quiz_session.join(params[:user_id], params[:full_name])
    return head(:bad_request) unless is_true(participator_id)

    render json: {
      participator_id: participator_id,
      quiz_id: quiz.id,
      quiz_session: quiz_session,
      participants: quiz_session.get_list_participants
    }, status: :ok
  end

  def get
    quiz = Quiz.find_by(id: params[:quiz_id])
    return head(:not_found) unless is_true(quiz) and quiz

    data_quiz = quiz.questions_with_content
    render json: data_quiz, status: :ok
  end

  def submit
    answer_params = params.require(:answer).permit(:quiz_session_id, :question_id, :participator_id, :option_id, :content)
    answer = Answer.new(answer_params)

    if answer.save
      QuestionUtils.add_answer_to_question(params[:data], answer.id, params[:type])
      render json: { message: 'Answer added successfully' }, status: :ok
    else
      render json: { error: answer.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
