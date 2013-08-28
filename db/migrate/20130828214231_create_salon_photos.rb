class CreateSalonPhotos < ActiveRecord::Migration
  def change
    create_table :salon_photos do |t|
      t.attachment :image
      t.integer :salon_gallery_id

      t.timestamps
    end
    add_index :salon_photos, :salon_gallery_id
  end
end
