# 11/15/2014] I added pagination so we can browse all of the masterpieces! :)
# To see the original code from 180 Websites, check out 
# commit bc9bb05faa08fb6e49cbcfb8fceee3bb46b600cc

class PicturePen::PicturesController < ApplicationController
  def index
    @title = "Picture Pen"
    @pictures = PicturePenPicture.order('created_at DESC').page(params[:page]).per(30)
  end

  def new
    @title = "Picture Pen"
  end

  def create 
    picture = PicturePenPicture.create(:image => params[:image])
    
    respond_to do |format|
      format.json { render :json => picture.slug.to_json }
    end
  end

  def show
    @title = "Picture Pen"
    @picture = PicturePenPicture.find_by_slug(params[:id])
  end
end
