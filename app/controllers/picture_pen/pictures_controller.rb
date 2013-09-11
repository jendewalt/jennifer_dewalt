class PicturePen::PicturesController < ApplicationController
  def index
    @title = "Picture Pen"
    @pictures = PicturePenPicture.limit(20).order('created_at DESC')
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
