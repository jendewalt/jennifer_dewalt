class FixPostboredColumnNames < ActiveRecord::Migration
  def change
    rename_column :postbored_sites, :postbored_sites_url, :url
    rename_column :postbored_sites, :postbored_sites_title, :title
    rename_column :postbored_sites, :postbored_sites_type, :type
  end
end
