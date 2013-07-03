class Swivel::GameController < ApplicationController
  def index
    @title = Swivel
    @user = current_user
  end
end
