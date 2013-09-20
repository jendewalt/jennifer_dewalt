class Chromatones::PalettesController < ApplicationController
  def index
    @title = "Chromatones"
    @palettes = ChromatonesPalette.limit(20).order('created_at DESC')
  end

  def create
    data = params['colors'] ? params['colors'].map{ |k,v| v} : []
    title = 'An Awesome Palette'
    name = 'Someone'

    unless data.length == 0
      data.each do |obj|
        if obj[:title] && !obj[:title].blank?
          title = obj[:title]
        elsif obj[:name] && !obj[:name].blank?
          name = obj[:name] 
        end
      end

      colors = data.reject { |obj| obj[:title] || obj[:name] }
    end

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
