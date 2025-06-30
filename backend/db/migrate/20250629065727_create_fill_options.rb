class CreateFillOptions < ActiveRecord::Migration[7.1]
  def change
    create_table :fill_options do |t|
      t.references :question, null: false, foreign_key: { to_table: :questions, on_delete: :cascade }
      t.text :reply

      t.timestamps
    end
  end
end
