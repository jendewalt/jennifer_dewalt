class CreateChromatonesPalettes < ActiveRecord::Migration
  def change
    create_table :chromatones_palettes do |t|
      t.string :title
      t.string :name
      t.text :colors

      t.timestamps
    end
  end
end
