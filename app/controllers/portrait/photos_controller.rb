class Portrait::PhotosController < ApplicationController
  def index
    @title = "Portrait"
    @current_portrait = PortraitPhoto.limit(1).order('created_at DESC')[0]
  end

  def new
    @title = "Portrait"
    @current_portrait = PortraitPhoto.limit(1).order('created_at DESC')
  end

  def create
    photo = PortraitPhoto.create(:image => params[:image])
    
    respond_to do |format|
      format.js { render :json => photo.id }
    end
  end

  def show
    @title = "Portrait"
    @current_portrait = PortraitPhoto.find(params[:id])
  end
end
