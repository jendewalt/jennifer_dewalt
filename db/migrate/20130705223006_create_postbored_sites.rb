class CreatePostboredSites < ActiveRecord::Migration
  def change
    create_table :postbored_sites do |t|
      t.string :postbored_sites_url
      t.string :postbored_sites_title
      t.integer :user_id
      t.string :postbored_sites_type

      t.timestamps
    end
    add_index :postbored_sites, :user_id
    add_index :postbored_sites, :postbored_sites_type
    add_index :postbored_sites, [:user_id, :postbored_sites_url], :unique => true
  end
end
