class Snare::SnareController < ApplicationController
  def index
    @title = Snare
    @user = current_user
  end
end
