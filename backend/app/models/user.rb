class User < ApplicationRecord
  has_many :participation, as: :participator
  has_secure_password
end
