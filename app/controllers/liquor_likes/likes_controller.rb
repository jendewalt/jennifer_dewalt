class LiquorLikes::LikesController < ApplicationController
  before_filter :authenticate_user!, :only => [:create]

  def create
    current_user.liquor_likes_likes.create(:liquor_likes_liquor_id => params[:liquor_id])
    render :nothing => true
  end
end
