class Salon::GalleriesController < ApplicationController
  def index
    @title = "Salon"
    @gallery = SalonGallery.new
  end

  def edit
    @title = "Salon"
    @gallery = SalonGallery.find_by_slug(params[:id])
  end

  def show
    @title = "Salon"
    @gallery = SalonGallery.find_by_slug(params[:id])
  end

  def create
    gallery = SalonGallery.create(:title => params[:salon_gallery][:title])

    redirect_to :action => :edit, :id => gallery.slug
  end

  def update
    gallery = SalonGallery.find_by_slug(params[:id])
    photo = gallery.salon_photos.create(:image => params[:file])

    respond_to do |format|
      format.js { render :nothing => true }
    end
  end
end
