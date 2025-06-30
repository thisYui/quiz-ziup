class CreateParticipations < ActiveRecord::Migration[7.1]
  def change
    create_table :participations do |t|
      t.references :quiz, null: false, foreign_key: { to_table: :quizzes, on_delete: :cascade }
      t.references :participator, polymorphic: true, null: false
      t.datetime :time
      t.integer :score, default: 0

      t.timestamps
    end
  end
end
