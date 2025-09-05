class ChoiceOption < ApplicationRecord
  belongs_to :question
  
  def self.update_option_and_result_from_question_father(new_data, question_id)
    new_data.each do |option_data|
      option = ChoiceOption.find_by(id: option_data[:id], question_id: question_id)
      return nil unless option

      updated = false
      if option_data[:content].present?
        option.content = option_data[:content]
        updated = true
      end
      if option_data[:is_correct].present?
        option.is_correct = option_data[:is_correct]
        updated = true
      end

      return nil if updated && !option.save

      true
    end
  end

  def remove_option
    ActiveRecord::Base.transaction do
      # giảm position các option phía sau
      ChoiceOption.where(question_id: self.question_id)
                  .where("position > ?", self.position)
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
