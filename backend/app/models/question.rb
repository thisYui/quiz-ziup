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

  TYPE = {
    single_choice: 0,
    multiple_choice: 1,
    matching: 2,
    fill_in: 3
  }

  def self.remove_with_condition(question_id)
    question = Question.find_by(id: question_id)
    return nil unless question

    ActiveRecord::Base.transaction do
      # Giảm vị trí của các câu hỏi phía sau
      Question.where(quiz_id: question.quiz_id)
              .where("position > ?", question.position)
              .find_each do |q|
        q.position -= 1
        q.save!  # raise exception nếu lỗi
      end

      # Xóa câu hỏi
      question.destroy!  # raise exception nếu lỗi
    end

    true
  rescue => e
    Rails.logger.error("Lỗi khi xóa câu hỏi: #{e.message}")
    nil
  end
end
