class CreateAudioGardenGardens < ActiveRecord::Migration
  def change
    create_table :audio_garden_gardens do |t|
      t.text :beats
      t.text :notes
      t.integer :slug

      t.timestamps
    end
    add_index :audio_garden_gardens, :slug
  end
end
