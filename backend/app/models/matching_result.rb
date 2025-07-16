class MatchingResult < ApplicationRecord
  belongs_to :option_left, class_name: 'MatchingOption', dependent: :destroy
  belongs_to :option_right, class_name: 'MatchingOption', dependent: :destroy
end
