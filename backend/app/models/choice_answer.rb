class ChoiceAnswer < ApplicationRecord
  belongs_to :question
  belongs_to :answer
end
