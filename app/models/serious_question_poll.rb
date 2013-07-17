class SeriousQuestionPoll < ActiveRecord::Base
  attr_accessible :self_votes, :that_votes, :this_votes
end
