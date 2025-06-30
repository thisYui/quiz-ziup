class Answer < ApplicationRecord
  belongs_to :participation
  belongs_to :question
  belongs_to :answerable, polymorphic: true
end
