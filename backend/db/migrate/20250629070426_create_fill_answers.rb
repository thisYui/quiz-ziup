class CreateFillAnswers < ActiveRecord::Migration[7.1]
  def change
    create_table :fill_answers do |t|
      t.references :question, null: false, foreign_key: { to_table: :questions, on_delete: :cascade }
      t.references :answer, null: false, foreign_key: { to_table: :answers, on_delete: :cascade }
      t.text :content

      t.timestamps
    end
  end
end
