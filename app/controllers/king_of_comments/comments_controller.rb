class KingOfComments::CommentsController < ApplicationController
  def index
    @title = 'King of the Comments'
    @comment = KingOfCommentsComment.new
    @comments = KingOfCommentsComment.order('votes DESC')
  end

  def create
    name = params[:king_of_comments_comment][:name]
    content = params[:king_of_comments_comment][:content]

    comment = KingOfCommentsComment.new(:name => name, :content => content, :votes => 0)
    if comment.save
      redirect_to :action => :index
    end    
  end

  def update
    comment = KingOfCommentsComment.find(params[:id])
    vote = params[:vote]

    comment.votes = comment.votes + vote.to_i
    if comment.save
      redirect_to :action => :index
    end
  end

end
