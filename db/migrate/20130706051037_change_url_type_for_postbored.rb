class ChangeUrlTypeForPostbored < ActiveRecord::Migration
  def change
    change_column :postbored_sites, :url, :text
  end
end
