class CreatePolychromeShows < ActiveRecord::Migration
  def change
    create_table :polychrome_shows do |t|
      t.string :slug
      t.text :show_data

      t.timestamps
    end
    add_index :polychrome_shows, :slug
  end
end
