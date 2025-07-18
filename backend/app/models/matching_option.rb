class MatchingOption < ApplicationRecord
  belongs_to :question
  has_many :matching_results, dependent: :destroy
  enum side: { left: 0, right: 1 }

  def self.update_option_from_question_father(new_data, question_id)
    new_data.each do |option_data|
      option = MatchingOption.find_by(id: option_data[:id], question_id: question_id)
      return nil unless option

      if option_data[:content].present?
        option.content = option_data[:content]
        return nil unless option.save
      end

      true
    end
  end

  def remove_option
    ActiveRecord::Base.transaction do
      # giảm position các option phía sau
      MatchingOption.where(question_id: self.question_id)
                  .where("side = ? AND position > ?", self.side, self.position)
                  .each do |option|
        option.position -= 1
        option.save!  # raise nếu lỗi
      end

      # xóa bản thân
      self.destroy!  # raise nếu lỗi
    end

    true
  rescue => e
    Rails.logger.error("Lỗi khi xóa option: #{e.message}")
    false
  end
end
