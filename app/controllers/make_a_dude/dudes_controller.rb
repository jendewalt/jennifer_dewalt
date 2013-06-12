class MakeADude::DudesController < ApplicationController
  def index
    @title = "Make A Dude"
    @dudes = MakeADudeDude.order('created_at DESC')
  end

  def new 
    @title = "Make A Dude"
    @dude = MakeADudeDude.new
  end

  def create
    name = params[:make_a_dude_dude][:name]
    message = params[:make_a_dude_dude][:message]
    color = params[:make_a_dude_dude][:color]
      
    dude = MakeADudeDude.create(:name => name, :message => message, :color => color)
    if dude.save
      redirect_to :action => :index
    else
      #handle not saving probably by flash notification
    end
  end

end
