class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.text :full_name
      t.text :email
      t.text :avatar_url, default: "../assets/images/default_avatar.png"
      t.string :password_digest
      t.date :birth_date

      t.timestamps
    end

    add_index :users, :email, unique: true
  end
end
