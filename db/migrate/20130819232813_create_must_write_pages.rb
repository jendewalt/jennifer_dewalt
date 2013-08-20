class CreateMustWritePages < ActiveRecord::Migration
  def change
    create_table :must_write_pages do |t|
      t.text :content
      t.string :slug

      t.timestamps
    end
    add_index :must_write_pages, :slug
  end
end
