class CreateTasteEntries < ActiveRecord::Migration
  def change
    create_table :taste_entries do |t|
      t.string :name
      t.string :kind
      t.integer :rating
      t.text :comments
      t.integer :user_id
      t.attachment :image

      t.timestamps
    end
    add_index :taste_entries, :user_id
  end
end
