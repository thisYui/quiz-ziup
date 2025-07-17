class QuizUtils
  def self.get_quiz_info(quiz_session_id, participator_id)
    # Lấy các answer của người tham gia trong quiz session
    answers = Answer.where(quiz_session_id: quiz_session_id, participator_id: participator_id)

    info = []
    answers.each do |answer|
      info << QuestionUtils.get_content__answer__result(answer)
    end

    info
  end

end