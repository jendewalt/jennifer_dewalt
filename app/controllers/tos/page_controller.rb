class Tos::PageController < ApplicationController
  def index
    @title = 'TOS'
    @user = current_user
  end
end
