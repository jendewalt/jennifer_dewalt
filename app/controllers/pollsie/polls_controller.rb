class Pollsie::PollsController < ApplicationController
  def index
    @title = "Pollsie"
    @poll = PollsiePoll.new
  end

  def create
    poll = PollsiePoll.create(:question => params[:pollsie_poll][:question])
    answers = params[:answers]

    unless poll.question.strip.empty?

      if answers
        answers.reject!{ |a| a.strip.empty? }
      end

      if answers.length > 0
        answers.each do |ans|
          poll.pollsie_answers.create(:content => ans, :votes => 0)
        end
        redirect_to :action => :edit, :id => poll.slug and return
      end
    end

    redirect_to :action => :index
  end

  def edit
    @title = "Pollsie"
    @poll = PollsiePoll.find_by_slug(params[:id])
  end

  def update
    @poll = PollsiePoll.find_by_slug(params[:id])
    answer = @poll.pollsie_answers.find(params[:answer])
    
    if answer.increment!(:votes)
      redirect_to @poll
    end
  end

  def show
    @title = "Pollsie"
    @poll = PollsiePoll.find_by_slug(params[:id])
  end
end
