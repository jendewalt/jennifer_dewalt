class SalonGallery < ActiveRecord::Base
  attr_accessible :slug, :title

  has_many :salon_photos, :dependent => :destroy

  before_create :create_unique_slug

  def to_param
    slug
  end

  def create_unique_slug
    begin
      self[:slug] = SecureRandom.urlsafe_base64(8)
    end while PollsiePoll.exists?(:slug => self[:slug])
  end
end
