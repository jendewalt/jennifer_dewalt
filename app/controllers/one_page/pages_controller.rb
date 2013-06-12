class OnePage::PagesController < ApplicationController
  def show
    @title = 'One Page'
    begin
      @page = OnePagePage.find(params[:id])
    rescue
      @page = OnePagePage.create(:content => '') 
    end
  end

  def edit
    @title = 'One Page'
    @page = OnePagePage.find(params[:id]) 
  end

  def update
    content = params[:one_page_page][:content]
    OnePagePage.find(params[:id]).update_attributes(:content => content)
    redirect_to :action => :show
  end

end