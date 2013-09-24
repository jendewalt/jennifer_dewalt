class Chromatones::PalettesController < ApplicationController
  def index
    @title = "Chromatones"
    @palettes = ChromatonesPalette.order('created_at DESC').page(params[:page]).per(10)
  end

  def create
    data = params['colors'] ? params['colors'].map{ |k,v| v} : []
    title = 'An Awesome Palette'
    name = 'Someone'
    palette = 

    unless data.length == 0
      data.each do |obj|
        if obj[:title] && !obj[:title].blank? && obj[:title].length < 100
          title = obj[:title]
        elsif obj[:name] && !obj[:name].blank? && obj[:name].length < 100
          name = obj[:name] 
        end
      end
      colors = data.reject { |obj| obj[:title] || obj[:name] }
    end

    colors = colors ? colors : [];
    
    palette = ChromatonesPalette.create(:colors => colors.to_json, :name => name, :title => title)
    
    respond_to do |format|
      format.json { render :json => palette.id.to_json }
    end
  end

  def new
    @title = "Chromatones"
    @palette = ChromatonesPalette.new
  end

  def show
    @title = "Chromatones"
    @palette = ChromatonesPalette.find(params[:id])
  end
end
