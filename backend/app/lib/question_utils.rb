class QuestionUtils
  def self.update_question_content(question_data)
    return nil if question_data.nil? || question_data[:id].nil?

    question_id = question_data[:id]
    question = Question.find_by(id: question_id)
    return nil unless question

    # cập nhật từng trường nếu có
    question.content     = question_data[:content]     if question_data[:content].present?
    question.description = question_data[:description] if question_data[:description].present?
    question.level       = question_data[:level]       if question_data[:level].present?
    question.time        = question_data[:time]        if question_data[:time].present?
    question.score       = question_data[:score]       if question_data[:score].present?

    # nếu có cập nhật type thì xóa dữ liệu cũ trước khi cập nhật
    if question_data[:question_type].present?
      success = delete_option_and_result_of_question(question.id)
      return nil unless success

      question.question_type = question_data[:question_type]
    end

    return nil unless question.save

    true
  end

  def self.delete_option_and_result_of_question(question_id)
    question = Question.find_by(id: question_id)
    return nil unless question

    case question.question_type
    when 0, 1 # Single / Multiple Choice
      options = ChoiceOption.where(question_id: question_id)
      return nil if options.destroy_all.empty?

    when 2 # Matching
      options = MatchingOption.where(question_id: question_id)
      return nil if options.destroy_all.empty?

      results = MatchingResult.where(question_id: question_id)
      return nil if results.destroy_all.empty?

    when 3 # Fill in the blank
      results = FillResult.where(question_id: question_id)
      return nil if results.destroy_all.empty?
    else
      return nil # Không hỗ trợ loại câu hỏi này
    end

    true
  end

  def self.update_option_and_result_of_question(question_id, type, options_data, results_data)
    case type
    when 0, 1 # Single / Multiple Choice
      # Cập nhật các option của câu hỏi
      # Chỉ có thể thay đổi content và is_correct của option
      # KHÔNG thể thay đổi position của option
      return nil unless ChoiceOption.update_option_and_result_from_question_father(options_data, question_id)

    when 2 # Matching
      # Cập nhật các option và kết quả của câu hỏi Matching
      # Chỉ có thể thay đổi content của option
      # KHÔNG thể thay đổi position, side
      return nil unless MatchingOption.update_option_from_question_father(options_data, question_id)
      return nil unless MatchingResult.update_result_from_question_father(results_data, question_id)

    when 3 # Fill in the blank
      # Cập nhật các kết quả của câu hỏi Fill in the blank
      # Chỉ có thể thay đổi content của kết quả
      # Không có option
      return nil unless FillResult.update_option_and_result_from_question_father(results_data, question_id)

    else
      return nil # Không hỗ trợ loại câu hỏi này
    end

    true
  end

  def self.get_content__answer__result(answers)
    question = Question.find_by(id: answers.question_id)
    return nil unless question

    _question = {
      content: question.content,
      type: question.question_type,
      level: question.level,
      score: question.score
    }

    case answers.answerable_type
    when 0, 1 # Single / Multiple Choice
      choice_option = ChoiceOption.where(question_id: question.id)
      choice_answer = ChoiceAnswer.where(answer_id: answers.id)

      return {
        question: _question,
        options: choice_option.map do |option|
          {
            id: option.id,
            content: option.content,
            is_correct: option.is_correct,
            position: option.position
          }
        end,
        answers: choice_answer.map do |answer| { option_id: answer.choice_option_id } end
      }

    when 2 # Matching
      matching_option = MatchingOption.where(question_id: question.id)
      matching_result = MatchingResult.where(question_id: question.id)
      matching_answer = MatchingAnswer.where(answer_id: answers.id)

      return {
        question: _question,
        options: matching_option.map do |option|
          {
            id: option.id,
            content: option.content,
            side: option.side,
            position: option.position
          }
        end,
        results: matching_result.map do |result|
          {
            option_left_id: result.option_left_id,
            option_right_id: result.option_right_id
          }
        end,
        answers: matching_answer.map do |answer|
          {
            option_left_id: answer.option_left_id,
            option_right_id: answer.option_right_id
          }
        end
      }

    when 3 # Fill in the blank
      fill_result = FillResult.where(question_id: question.id)
      fill_answer = FillAnswer.find_by(answer_id: answers.id)

      return {
        question: _question,
        results: fill_result.map do |result| { content: result.content } end,
        answers: fill_answer
      }

    else
      return nil
    end
  end
end