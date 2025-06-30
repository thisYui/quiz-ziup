class ChoiceOption < ApplicationRecord
  belongs_to :question, dependent: :destroy
end
