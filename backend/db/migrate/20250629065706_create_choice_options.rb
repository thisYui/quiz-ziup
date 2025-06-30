class CreateChoiceOptions < ActiveRecord::Migration[7.1]
  def change
    create_table :choice_options do |t|
      t.references :question, null: false, foreign_key: { to_table: :questions, on_delete: :cascade }
      t.text :content
      t.boolean :is_correct
      t.integer :position  # thứ tự của lựa chọn trong câu hỏi

      t.timestamps
    end
  end
end
