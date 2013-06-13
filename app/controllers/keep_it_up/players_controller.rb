class KeepItUp::PlayersController < ApplicationController
  def index
    @title = 'Keep It Up'
    @player = KeepItUpPlayer.new
    @leaders = KeepItUpPlayer.find(:all, :order => 'score DESC', :limit => 10)
  end

  def create   
    name = params[:keep_it_up_player][:name]
    score = params[:keep_it_up_player][:score]

    player = KeepItUpPlayer.create(:name => name, :score => score)
    
    if player.save
      redirect_to :action => :index
    else
      #handle not saving probably by flash notification
    end
  end
end
