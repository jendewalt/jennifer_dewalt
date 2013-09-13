class FixColumnsAudioGarden < ActiveRecord::Migration
  def change
    remove_column :audio_garden_gardens, :notes
    
    rename_column :audio_garden_gardens, :beats, :garden
  end
end
