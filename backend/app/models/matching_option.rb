class MatchingOption < ApplicationRecord
  belongs_to :question, dependent: :destroy
  enum side: { left: 0, right: 1 }
end
