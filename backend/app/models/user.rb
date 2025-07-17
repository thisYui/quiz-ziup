class User < ApplicationRecord
  has_many :participation, as: :participator, dependent: :destroy
  has_many :quizzes, dependent: :destroy
  has_many :jwt_tokens, dependent: :destroy
  has_secure_password

end
