class LiquorLikes::LiquorsController < ApplicationController

  def index
    @title = 'Liquor Likes'
    @user = current_user
    @liquors = LiquorLikesLiquor.order('liquor_likes_likes_count DESC NULLS LAST')
  end

  def new
    @title = 'Liquor Likes'
    @liquor = LiquorLikesLiquor.new
  end

  def show
    @title = 'Liquor Likes'
    @liquor = LiquorLikesLiquor.find(params[:id])
    @likers = @liquor.users
  end

  def create
    name = params[:liquor_likes_liquor][:name]
    description = params[:liquor_likes_liquor][:description]

    liquor = LiquorLikesLiquor.new(:name => name, :description => description)
    if liquor.save
      redirect_to :action => :index
    else
      #handle not saving probably by flash notification
    end
  end
end
