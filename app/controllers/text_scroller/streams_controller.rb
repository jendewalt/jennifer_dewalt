class TextScroller::StreamsController < ApplicationController
  def index
    @title = "Text Scroller"
    @user = current_user
  end

end
