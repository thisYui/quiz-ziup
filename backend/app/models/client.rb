class Client < ApplicationRecord
  has_many :participation, as: :participator
end