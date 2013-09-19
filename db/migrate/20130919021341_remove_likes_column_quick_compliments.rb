class RemoveLikesColumnQuickCompliments < ActiveRecord::Migration
  def change
    remove_column :quick_compliments_compliments, :likes
  end
end
