class PollsieAnswer < ActiveRecord::Base
  attr_accessible :votes, :content
  belongs_to :pollsie_poll
end
