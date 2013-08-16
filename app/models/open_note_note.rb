class OpenNoteNote < ActiveRecord::Base
  attr_accessible :content, :slug
  before_create :create_unique_slug

  def to_param
    slug
  end

  def create_unique_slug
    begin
      self[:slug] = SecureRandom.urlsafe_base64(8)
    end while OpenNoteNote.exists?(:slug => self[:slug])
  end
end
