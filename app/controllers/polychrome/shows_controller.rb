class Polychrome::ShowsController < ApplicationController
  def index
    @title = 'Polychrome'
    @show = PolychromeShow.new
  end

  def create
    show_data = params['show'] ? params['show'].map{ |k,v| v} : []

    show = PolychromeShow.create(:show_data => show_data.to_json)
    
    respond_to do |format|
      format.json { render :json => show.slug.to_json }
    end
  end

  def show
    @title = 'Polychrome'
    @show = PolychromeShow.find_by_slug(params[:id])
  end
end
