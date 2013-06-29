class Hourglass::TimerController < ApplicationController
  def index
    @title = 'hourglass'
    @user = current_user
  end
end
