class QuickWords::GameController < ApplicationController
  def index
    @title = 'Quick Words'
    @user = current_user
  end
end
