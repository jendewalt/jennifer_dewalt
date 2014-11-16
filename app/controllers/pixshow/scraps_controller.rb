# 11/15/2014] I added pagination so we can browse all of the masterpieces! :)
# To see the original code from 180 Websites, check out 
# commit bc9bb05faa08fb6e49cbcfb8fceee3bb46b600cc

class Pixshow::ScrapsController < ApplicationController
  def index
    @title = 'PixShow'
    @scrap = PixshowScrap.new
    @scraps = PixshowScrap.order('created_at DESC').page(params[:page]).per(100)
  end

  def create
    if params[:pixshow_scrap] 
      @scrap = PixshowScrap.new(params[:pixshow_scrap])
      @scrap.save
    end

    redirect_to :action => :index
  end
end
