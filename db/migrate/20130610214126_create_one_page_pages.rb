class CreateOnePagePages < ActiveRecord::Migration
  def change
    create_table :one_page_pages do |t|
      t.text :content

      t.timestamps
    end
  end
end
