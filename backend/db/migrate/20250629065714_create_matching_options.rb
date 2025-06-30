class CreateMatchingOptions < ActiveRecord::Migration[7.1]
  def change
    create_table :matching_options do |t|
      t.references :question, null: false, foreign_key: { to_table: :questions, on_delete: :cascade }
      t.text :content
      t.integer :side  # 0: left, 1: right
      t.integer :position  # Thứ tự của option trong câu hỏi

      t.timestamps
    end
  end
end
