class FishyFriend::FishController < ApplicationController
  def index
    @title = 'Fishy Friend'
    @user = current_user
  end
end
