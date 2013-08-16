class CreateOpenNoteNotes < ActiveRecord::Migration
  def change
    create_table :open_note_notes do |t|
      t.string :slug
      t.text :content

      t.timestamps
    end
    add_index :open_note_notes, :slug
  end
end
