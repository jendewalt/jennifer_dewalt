class TweetTime::PageController < ApplicationController
  def index
    @title = "Tweet Time"
  end

  def create 
    username = params[:username]

    results = Twitter.user_timeline(username, :count => 200)

    @tweets = results.map do |tweet| 
      { text: tweet.text, time: tweet.created_at }
    end

    respond_to do |format|
      format.html
      format.json { render :json => @tweets }
    end    
  end
end
