class PostboredSite < ActiveRecord::Base
  attr_accessible :title, :tag, :url, :user_id
  belongs_to :user
  validates :user_id, presence: true

  default_scope order: 'postbored_sites.created_at DESC'
end
