class QuickCompliments::ComplimentsController < ApplicationController
  def index
    @title = "Quick Compliments"
    @compliment = QuickComplimentsCompliment.offset(rand(QuickComplimentsCompliment.count)).first

    @new_compliment = QuickComplimentsCompliment.new
  end

  def create
    message = params[:quick_compliments_compliment][:message]

    if message && !message.blank?
      message.strip!
      compliment = QuickComplimentsCompliment.create(:message => message)
      flash[:created] = "Thanks for adding a compliment! Here is another compliment for you!"
    end

    redirect_to :action => :index
  end
end
