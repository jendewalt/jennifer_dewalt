class OpenNote::NotesController < ApplicationController
  def index
    @title = 'Open Note'
    @note = OpenNoteNote.new
  end

  def show
    @title = "Open Note"
    @note = OpenNoteNote.find_by_slug(params[:id]);
  end

  def create
    content = params[:open_note_note][:content]
    @note = OpenNoteNote.create(:content => content)
    redirect_to @note, id: @note.slug
  end

  def update
    content = params[:open_note_note][:content]
    OpenNoteNote.find_by_slug(params[:id]).update_attributes(:content => content)
    redirect_to :action => :show
  end
end
