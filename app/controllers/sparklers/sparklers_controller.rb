class Sparklers::SparklersController < ApplicationController
  def index
    @title = Sparklers
    @user = current_user
  end
end
