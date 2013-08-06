class ShareASecret::SecretsController < ApplicationController

  def index
    @title = 'Share a Secret'
    @new_secret = ShareASecretSecret.new
  end

  def create
    description = params[:new_secret]
    if description && !description.blank? && description.length <= 255 && description.length > 10
      ShareASecretSecret.create(:description => description)
    end

    @retrieved_secret = ShareASecretSecret.offset(rand(ShareASecretSecret.count)).first
    
    respond_to do |format|
      format.html
      format.json { render :json => @retrieved_secret.description }
    end    
  end
end
