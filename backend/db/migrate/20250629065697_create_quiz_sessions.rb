class CreateQuizSessions < ActiveRecord::Migration[7.1]
  def change
    create_table :quiz_sessions do |t|
      t.references :quiz, null: false, foreign_key: { to_table: :quizzes, on_delete: :cascade }
      t.boolean :is_ended, default: false, null: false
      t.integer :count_registered, default: 0

      t.timestamps
    end
  end
end
