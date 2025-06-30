class CreateAnswers < ActiveRecord::Migration[7.1]
  def change
    create_table :answers do |t|
      t.references :participations, null: false, foreign_key: { to: :participations, on_delete: :cascade }
      t.references :question, null: false, foreign_key: { to: :questions, on_delete: :cascade }
      t.references :answerable, polymorphic: true, null: false

      t.timestamps
    end
  end
end
