class FillAnswer< ApplicationRecord
  belongs_to :question, dependent: :destroy
  has_many :answer, as: :answerable
end
