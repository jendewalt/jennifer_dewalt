class Here::PageController < ApplicationController
  def index
    @title = "You Are Here"
  end

  def create
    lat = params[:lat]
    lng = params[:lng]
    instagrams = Instagram.media_search(lat, lng, {:count => 30, :distance => 5000})

    @image_urls = instagrams.map do |instagram|
      { img_url: instagram.images.low_resolution.url }
    end

    respond_to do |format|
      format.html
      format.json { render :json => @image_urls }
    end    
  end
end
