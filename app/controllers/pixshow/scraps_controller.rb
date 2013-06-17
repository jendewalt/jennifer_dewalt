class Pixshow::ScrapsController < ApplicationController
  def index
    @title = 'PixShow'
    @scrap = PixshowScrap.new
    @scraps = PixshowScrap.limit(100).order('created_at DESC')
  end

  def create
    if params[:pixshow_scrap] 
      @scrap = PixshowScrap.new(params[:pixshow_scrap])
      @scrap.save
    end

    redirect_to :action => :index
  end
end
