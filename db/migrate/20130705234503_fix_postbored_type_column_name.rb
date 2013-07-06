class FixPostboredTypeColumnName < ActiveRecord::Migration
  def change
    rename_column :postbored_sites, :type, :tag
  end
end
