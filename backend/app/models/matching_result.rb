class MatchingResult < ApplicationRecord
  belongs_to :option_left, class_name: 'MatchingOption'
  belongs_to :option_right, class_name: 'MatchingOption'

  def self.update_result_from_question_father(new_data, question_id)
    new_data.each do |result_data|
      result = MatchingResult.find_by(id: result_data[:id], question_id: question_id)
      return nil unless result

      updated = false
      if result_data[:option_left_id].present?
        result.option_left_id = result_data[:option_left_id]
        updated = true
      end
      if result_data[:option_right_id].present?
        result.option_right_id = result_data[:option_right_id]
        updated = true
      end

      return nil if updated && !result.save

      true
    end
  end
end
