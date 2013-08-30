class CreatePortraitPhotos < ActiveRecord::Migration
  def change
    create_table :portrait_photos do |t|
      t.attachment :image

      t.timestamps
    end
  end
end
