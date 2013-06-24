class CreateLiquorLikesLikes < ActiveRecord::Migration
  def change
    create_table :liquor_likes_likes do |t|
      t.integer :liquor_likes_liquor_id
      t.integer :user_id

      t.timestamps
    end
    add_index :liquor_likes_likes, :user_id
    add_index :liquor_likes_likes, :liquor_likes_liquor_id
    add_index :liquor_likes_likes, [:user_id, :liquor_likes_liquor_id], :unique => true
  end
end
