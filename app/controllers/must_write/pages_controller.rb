class MustWrite::PagesController < ApplicationController
  def index
    @title = 'Must Write'
    @page = MustWritePage.new
  end

  def show
    @title = "Must Write"
    @page = MustWritePage.find_by_slug(params[:id]);
  end

  def create
    @page = MustWritePage.create(:content => '')
    redirect_to @page, id: @page.slug
  end

  def update
    content = params[:content]
    MustWritePage.find_by_slug(params[:id]).update_attributes(:content => content)

    respond_to do |format|
      format.html
      format.json { render :nothing => true }
    end
  end
end
