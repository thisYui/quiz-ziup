class ChoiceAnswer < ApplicationRecord
  belongs_to :choice_option, dependent: :destroy
  has_many :answer, as: :answerable
end
