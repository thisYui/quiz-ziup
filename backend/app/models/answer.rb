class Answer < ApplicationRecord
  belongs_to :participation
  belongs_to :question
  belongs_to :answerable, polymorphic: true
  enum magic_points: {
    none: 0,
    double_score: 1,
    auto_correct: 2
  }
end
