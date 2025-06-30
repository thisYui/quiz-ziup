class CreateQuestions < ActiveRecord::Migration[7.1]
  def change
    create_table :questions do |t|
      t.references :quiz, null: false, foreign_key: true
      t.text :content
      t.integer :question_type
      t.integer :score, default: 1
      t.integer :level

      t.timestamps
    end
  end
end
