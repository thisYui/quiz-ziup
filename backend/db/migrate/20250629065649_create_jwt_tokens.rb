class CreateJwtTokens < ActiveRecord::Migration[7.1]
  def change
    create_table :jwt_tokens do |t|
      t.references :user, null: false, foreign_key: { to_table: :users, on_delete: :cascade }
      t.string :jti  # JSON Web Token ID, unique identifier for the token
      t.datetime :exp   # Expiration time of the token
      t.string :device    # Phone, Chrome, Firefox, etc.
      t.string :ip_address
      t.string :user_agent

      t.timestamps
    end

    add_index :jwt_tokens, :jti, unique: true
  end
end
