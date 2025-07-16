class Participation < ApplicationRecord
  belongs_to :participator, polymorphic: true, dependent: :destroy
  belongs_to :quiz_session, dependent: :destroy
end