class CreatePicturePenPictures < ActiveRecord::Migration
  def change
    create_table :picture_pen_pictures do |t|
      t.attachment :image
      t.string :slug

      t.timestamps
    end
    add_index :picture_pen_pictures, :slug
  end
end
