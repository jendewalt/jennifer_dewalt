# [11/15/2014] I added pagination so the data will actually return :)
# To see the original code from 180 Websites, check out 
# commit bc9bb05faa08fb6e49cbcfb8fceee3bb46b600cc

class KingOfComments::CommentsController < ApplicationController
  def index
    @title = 'King of the Comments'
    @comment = KingOfCommentsComment.new
    @comments = KingOfCommentsComment.order('votes DESC').page(params[:page]).per(30)
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
