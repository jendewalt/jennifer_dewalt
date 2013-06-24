class CreateLiquorLikesLiquors < ActiveRecord::Migration
  def change
    create_table :liquor_likes_liquors do |t|
      t.string :name
      t.text :description
      t.integer :liquor_likes_likes_count

      t.timestamps
    end
    add_index :liquor_likes_liquors, :liquor_likes_likes_count
  end
end
