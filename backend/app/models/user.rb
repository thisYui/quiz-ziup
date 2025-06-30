class User < ApplicationRecord
  has_many :participation, as: :participator
end
