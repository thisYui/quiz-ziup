class FillResult < ApplicationRecord
  belongs_to :question, dependent: :destroy
end
