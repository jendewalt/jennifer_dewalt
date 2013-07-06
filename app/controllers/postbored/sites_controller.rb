class Postbored::SitesController < ApplicationController
  before_filter :authenticate_user!, :only => [:new, :create]

  def index
    @title = 'Postbored'
    @user = current_user
    @sites = PostboredSite.limit(100)
  end

  def new
    @title = 'Postbored'
    @user = current_user
    @site = PostboredSite.new
  end

  def create
    url = params[:postbored_site][:url]
    title = params[:postbored_site][:title]
    tag = params[:postbored_site][:tag]

    unless /^(http|https):\/\/|[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?$/ix.match(url).nil?
      unless url.start_with?('http://') || url.start_with?('https://')
        url = 'http://' + url
      end
      site = current_user.postbored_sites.new(:url => url, :title => title, :tag => tag)
      site.save
      redirect_to :action => :index
    else
      flash[:error] = "There was a problem with your URL. Please try again."
      redirect_to :action => :new
    end
  
    rescue
      flash[:error] = "Something went wrong. I'll let you know what happened when I'm better at Rails."
      redirect_to :action => :new
    
  end
end
