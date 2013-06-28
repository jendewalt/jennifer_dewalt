class Countdown::ClockController < ApplicationController
  def index
    @title = "Countdown Clock"
    @user = current_user
  end
end
