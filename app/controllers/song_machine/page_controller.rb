class SongMachine::PageController < ApplicationController
  def index
    @title = 'Song Machine'
    @user = current_user    
  end
end
