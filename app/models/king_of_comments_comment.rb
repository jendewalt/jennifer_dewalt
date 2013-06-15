class KingOfCommentsComment < ActiveRecord::Base
  attr_accessible :content, :name, :votes
end
