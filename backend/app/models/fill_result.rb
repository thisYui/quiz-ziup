class FillResult < ApplicationRecord
  belongs_to :question

  def self.update_option_and_result_from_question_father(new_data, question_id)
    new_data.each do |result_data|
      result = FillResult.find_by(id: result_data[:id], question_id: question_id)
      return nil unless result

      if result_data[:content].present?
        result.content = result_data[:content]
        return nil unless result.save
      end

      true
    end
  end
end
