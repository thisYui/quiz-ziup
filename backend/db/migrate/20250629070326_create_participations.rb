class CreateParticipations < ActiveRecord::Migration[7.1]
  def change
    create_table :participations do |t|
      t.references :quiz_sessions, null: false, foreign_key: { to_table: :quiz_sessions, on_delete: :cascade }
      t.references :participator, polymorphic: true, null: false
      t.integer :score, default: 0

      t.timestamps
    end
  end
end
