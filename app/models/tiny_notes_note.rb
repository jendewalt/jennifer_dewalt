class TinyNotesNote < ActiveRecord::Base
  attr_accessible :content
  belongs_to :user
  validates :user_id, presence: true, length: { maximum: 255 }

  default_scope order: 'tiny_notes_notes.created_at DESC'
end
