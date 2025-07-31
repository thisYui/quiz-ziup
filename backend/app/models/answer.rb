class Answer < ApplicationRecord
  belongs_to :participation
  belongs_to :question
  # enum magic_points: {
  #   no: 0,
  #   double_score: 1,
  #   auto_correct: 2
  # }
  # enum answerable_type: {
  #   single_option: 0,
  #   multiple_option: 1,
  #   matching: 2,
  #   fill_in: 3
  # }
end
