class CreateQuickComplimentsCompliments < ActiveRecord::Migration
  def change
    create_table :quick_compliments_compliments do |t|
      t.integer :likes
      t.text :message

      t.timestamps
    end
    add_index :quick_compliments_compliments, :likes
  end
end
