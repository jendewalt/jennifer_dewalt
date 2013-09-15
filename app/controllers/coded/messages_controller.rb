class Coded::MessagesController < ApplicationController
  def index
    @title = "Coded"
    @message = CodedMessage.new
  end

  def create
    title = params[:coded_message][:title]
    message = params[:coded_message][:message]

    if title && !title.blank? && title.length <= 255 && message && !message.blank? && message.length <= 255
      code = CodedMessage.create(:message => message, :title => title)
      redirect_to :action => :show, :id => code.slug
    else
      flash[:notice] = "Something went wrong with your request."
      redirect_to :action => :index
    end
  end

  def show
    @title = "Coded"
    @message = CodedMessage.find_by_slug(params[:id])
  end
end
