class Mastermind::GameController < ApplicationController
  def index
    @title = 'Mastermind'
    @user = current_user
  end
end
