class MatchingAnswer < ApplicationRecord
  belongs_to :question
  has_many :answer, as: :answerable
end
