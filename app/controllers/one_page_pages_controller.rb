class OnePagePagesController < ApplicationController
  def show
    @title = 'One Page'
    @page = OnePagePage.find(params[:id]) || OnePagePage.create(:content => '') 
  end

  def edit
    @title = 'One Page'
    @page = OnePagePage.find(params[:id]) 
  end

  def update
    content = params[:content]
    OnePagePage.find(params[:id]).update_attributes(:content => content)
    redirect_to :action => :show
  end

end