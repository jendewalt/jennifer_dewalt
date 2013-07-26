class GlobGlob::GlobsController < ApplicationController
  def show
    @title = "Glob Glob"

    unless GlobGlobGlob.exists?(1)
      GlobGlobGlob.create({name: 'First', size: '30'})
    end

    @glob = GlobGlobGlob.find(1)
  end

  def update
    GlobGlobGlob.find(1).update_attributes(:size => params[:size]); 
    render :nothing => true
  end
end
