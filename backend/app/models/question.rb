class Question < ApplicationRecord
  belongs_to :quiz, dependent: :destroy
  enum question_type: { single_choice: 0, multiple_choice: 1, matching: 2, fill_in: 3 }
  enum level: {
    easy: 0,
    medium: 1,
    hard: 2,
    very_hard: 3,
    extreme: 4
  }
end
