class MakeSlugColumnStringAudioGarden < ActiveRecord::Migration
  def up
    change_column :audio_garden_gardens, :slug, :string
  end

  def down
    change_column :audio_garden_gardens, :slug, :integer
  end
end
