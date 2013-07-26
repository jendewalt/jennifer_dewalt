class CreateGlobGlobGlobs < ActiveRecord::Migration
  def change
    create_table :glob_glob_globs do |t|
      t.string :name
      t.integer :size

      t.timestamps
    end
  end
end
