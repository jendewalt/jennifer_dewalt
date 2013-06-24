class LiquorLikesLiquor < ActiveRecord::Base
  attr_accessible :description, :name

  has_many :liquor_likes_likes 
  has_many :users, :through => :liquor_likes_likes
end
