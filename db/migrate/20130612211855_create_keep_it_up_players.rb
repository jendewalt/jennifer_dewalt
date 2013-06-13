class CreateKeepItUpPlayers < ActiveRecord::Migration
  def change
    create_table :keep_it_up_players do |t|
      t.string :name
      t.integer :score

      t.timestamps
    end
  end
end
