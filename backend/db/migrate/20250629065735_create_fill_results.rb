class CreateFillResults < ActiveRecord::Migration[7.1]
  def change
    create_table :fill_results do |t|
      t.references :question, null: false, foreign_key: { to_table: :questions, on_delete: :cascade }
      t.references :answerable, polymorphic: true, null: false
      t.text :content

      t.timestamps
    end
  end
end
