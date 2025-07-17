class Participation < ApplicationRecord
  belongs_to :participator, polymorphic: true, dependent: :destroy
  belongs_to :quiz_session
  has_many :answers, dependent: :destroy
end