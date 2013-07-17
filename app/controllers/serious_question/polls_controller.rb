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
    vote = params[:serious_question_poll]

    unless vote
      flash[:error] = "You cannot submit and empty form!"
      redirect_to :action => :edit and return      
    end

    if vote.has_key?(:this_votes)
      poll.this_votes += 1
      poll.save
    elsif vote.has_key?(:that_votes)      
      poll.that_votes += 1
      poll.save
    elsif vote.has_key?(:self_votes)
      poll.self_votes += 1
      poll.save
    end

    redirect_to :action => :show
  end
end
