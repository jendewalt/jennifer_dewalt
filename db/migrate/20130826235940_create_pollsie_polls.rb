class CreatePollsiePolls < ActiveRecord::Migration
  def change
    create_table :pollsie_polls do |t|
      t.string :slug
      t.string :question

      t.timestamps
    end
    add_index :pollsie_polls, :slug
  end
end
