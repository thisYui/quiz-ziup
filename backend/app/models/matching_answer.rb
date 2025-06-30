class MatchingAnswer < ApplicationRecord
  belongs_to :option_left, class_name: 'MatchingOption', dependent: :destroy
  belongs_to :option_right, class_name: 'MatchingOption', dependent: :destroy
  has_many :answer, as: :answerable
end
