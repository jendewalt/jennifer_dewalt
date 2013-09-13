class AudioGarden::GardensController < ApplicationController
  def index
    @title = "Audio Garden"
    @garden = AudioGardenGarden.new
  end

  def create
    notes = params['garden']['notes'] ? params['garden']['notes'].map{ |k,v| v} : []
    beats = params['garden']['beats'] ? params['garden']['beats'].map{ |k,v| v} : []
    width = params['garden']['width'] ? params['garden']['width'] : []
    height = params['garden']['height'] ? params['garden']['height'] : []

    garden = {notes: notes, beats: beats, width: width, height: height}

    audio_garden = AudioGardenGarden.create(:garden => garden.to_json)
    
    respond_to do |format|
      format.json { render :json => audio_garden.slug.to_json }
    end
  end

  def show 
    @title = "Audio Garden"
    @garden = AudioGardenGarden.find_by_slug(params[:id])
  end
end
 