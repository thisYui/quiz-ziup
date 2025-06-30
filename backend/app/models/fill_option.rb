class FillOption < ApplicationRecord
  belongs_to :question, dependent: :destroy
end
