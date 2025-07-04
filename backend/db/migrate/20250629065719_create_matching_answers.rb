class CreateMatchingAnswers < ActiveRecord::Migration[7.1]
  def change
    create_table :matching_answers do |t|
      t.references :option_left, null: false, foreign_key: { to_table: :matching_options, on_delete: :cascade }
      t.references :option_right, null: false, foreign_key: { to_table: :matching_options, on_delete: :cascade }
      t.references :answerable, polymorphic: true, null: false

      t.timestamps
    end
  end
end
