class CreateTinyNotesNotes < ActiveRecord::Migration
  def change
    create_table :tiny_notes_notes do |t|
      t.string :content
      t.integer :user_id

      t.timestamps
    end
    add_index :tiny_notes_notes, [:user_id, :created_at]
  end
end
