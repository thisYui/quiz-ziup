class CreateQuizzes < ActiveRecord::Migration[7.1]
  def change
    create_table :quizzes do |t|
      t.references :owner_user, null: false, foreign_key: { to_table: :users, on_delete: :cascade }
      t.text :code
      t.text :title
      t.text :description
      t.integer :status
      t.integer :max_participants
      t.string :key, default: nil  # Key for private quizzes
      t.integer :topic

      t.timestamps
    end
  end
end
