class CreateChoiceAnswers < ActiveRecord::Migration[7.1]
  def change
    create_table :choice_answers do |t|
      t.references :question, null: false, foreign_key: { to_table: :questions, on_delete: :cascade }
      t.references :choice_option, null: false, foreign_key: { to_table: :choice_options, on_delete: :cascade }
      t.references :answer, null: false, foreign_key: { to_table: :answers, on_delete: :cascade }

      t.timestamps
    end
  end
end
