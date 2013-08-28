class CreateSalonGalleries < ActiveRecord::Migration
  def change
    create_table :salon_galleries do |t|
      t.string :slug
      t.string :title

      t.timestamps
    end
    add_index :salon_galleries, :slug
  end
end
