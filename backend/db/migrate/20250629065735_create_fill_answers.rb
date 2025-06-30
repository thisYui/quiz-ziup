class CreateFillAnswers < ActiveRecord::Migration[7.1]
  def change
    create_table :fill_answers do |t|
      t.references :option, null: false, foreign_key: { to_table: :fill_options, on_delete: :cascade }
      t.references :answerable, polymorphic: true, null: false
      t.text :content

      t.timestamps
    end
  end
end
