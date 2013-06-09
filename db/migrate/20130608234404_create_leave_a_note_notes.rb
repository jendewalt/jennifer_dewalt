class CreateLeaveANoteNotes < ActiveRecord::Migration
  def change
    create_table :leave_a_note_notes do |t|
      t.text :content

      t.timestamps
    end
  end
end
