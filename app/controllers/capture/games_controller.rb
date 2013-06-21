class Capture::GamesController < ApplicationController
  def index
    @title = Capture
    @user = current_user
  end
end
