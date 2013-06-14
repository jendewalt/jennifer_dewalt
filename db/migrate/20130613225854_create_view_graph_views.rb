class CreateViewGraphViews < ActiveRecord::Migration
  def change
    create_table :view_graph_views do |t|
      t.float :x
      t.float :y

      t.timestamps
    end
  end
end
