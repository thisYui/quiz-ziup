class FillAnswer < ApplicationRecord
  belongs_to :fill_option, dependent: :destroy
  has_many :answer, as: :answerable
end
