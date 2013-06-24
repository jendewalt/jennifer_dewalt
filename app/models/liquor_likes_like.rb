class LiquorLikesLike < ActiveRecord::Base
  attr_accessible :liquor_likes_liquor_id, :user_id
  belongs_to :user
  belongs_to :liquor_likes_liquor, :counter_cache => true

  validates_presence_of :user_id
  validates_presence_of :liquor_likes_liquor_id

end
