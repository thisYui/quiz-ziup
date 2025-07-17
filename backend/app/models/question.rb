class Question < ApplicationRecord
  belongs_to :quiz
  enum question_type: { single_choice: 0, multiple_choice: 1, matching: 2, fill_in: 3 }
  enum level: {
    easy: 0,
    medium: 1,
    hard: 2,
    very_hard: 3,
    extreme: 4
  }

  def self.remove_with_condition(question_id)
    # Tìm câu hỏi
    question = Question.find_by(id: question_id)
    return nil unless question

    # Tìm tất cả các câu hỏi khác trong cùng quiz s
    all_questions = Question.where(quiz_id: question.quiz_id)

    position = question.position
    all_questions.each do |q|
      if q.position > position
        # Giảm vị trí của câu hỏi xuống 1 nếu nó nằm sau câu hỏi bị xóa
        q.update(position: q.position - 1)
      end
    end

    # Xóa câu hỏi
    return nil unless question.destroy
    true
  end
end
