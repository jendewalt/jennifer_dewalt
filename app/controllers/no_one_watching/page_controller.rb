class NoOneWatching::PageController < ApplicationController
  def index
    @title = 'No One Is Watching'
    @user = current_user
  end
end
