class Hollywood::SignController < ApplicationController
  def index
    @title = Hollywood
    @user = current_user
  end
end
