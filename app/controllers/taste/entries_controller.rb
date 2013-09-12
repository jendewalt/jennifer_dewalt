class Taste::EntriesController < ApplicationController
  respond_to :json, :html

  def index
    @title = "Taste"
    if current_user
      @entries = current_user.taste_entries.order('created_at ASC')
    end
  end

  def destroy
    entry = TasteEntry.find(params[:id])

    entry.destroy if entry.user == current_user
    render :nothing => true
  end

  def create
    current_user.taste_entries.create(params[:entry]) if current_user
    render :nothing => true
  end
end
