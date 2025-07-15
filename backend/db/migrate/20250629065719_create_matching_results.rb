class CreateMatchingResults < ActiveRecord::Migration[7.1]
  def change
    create_table :matching_results do |t|
      t.references :option_left, null: false, foreign_key: { to_table: :matching_options, on_delete: :cascade }
      t.references :option_right, null: false, foreign_key: { to_table: :matching_options, on_delete: :cascade }

      t.timestamps
    end
  end
end
