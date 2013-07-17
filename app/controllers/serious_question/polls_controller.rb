class SeriousQuestion::PollsController < ApplicationController
  def edit
    @title = "Serious Question"

    unless SeriousQuestionPoll.exists?(1)
      SeriousQuestionPoll.create({this_votes: 0, that_votes: 0, self_votes: 0})
    end

    @poll = SeriousQuestionPoll.find(1)
  end

  def show
    @title = "Serious Question"
    @poll = SeriousQuestionPoll.find(1)
    @total = @poll.this_votes + @poll.that_votes + @poll.self_votes
    
    @this_percent = (@poll.this_votes / (@total * 1.0) * 100).round(2)
    @that_percent = (@poll.that_votes / (@total * 1.0) * 100).round(2)
    @self_percent = (@poll.self_votes / (@total * 1.0) * 100).round(2)
  end

  def update
    poll = SeriousQuestionPoll.find(1)
    vote = params[:vote]

    unless vote
      flash[:error] = "You cannot submit an empty form!"
      redirect_to :action => :edit and return      
    end

    if vote = 'this'
      poll.this_votes += 1
      poll.save
    elsif vote = 'tht'      
      poll.that_votes += 1
      poll.save
    elsif vote = self
      poll.self_votes += 1
      poll.save
    end

    redirect_to :action => :show
  end
end
