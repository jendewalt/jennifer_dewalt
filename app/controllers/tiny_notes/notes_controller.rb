class TinyNotes::NotesController < ApplicationController
  before_filter :authenticate_user!, :only => [:create]

  def index
    @title = 'Tiny Notes'
    @notes = TinyNotesNote.limit(100)
    @note = TinyNotesNote.new
    @user = current_user
  end

  def show
    @title = 'Tiny Notes'
    @user = current_user
    @owner = User.find(params[:id])
    @notes = @owner.tiny_notes_notes
  end

  def create
    content = params[:tiny_notes_note][:content]
    if content && !content.blank?
      content.strip!
      note = current_user.tiny_notes_notes.new(:content => content)
      if note.save
        redirect_to :action => :index
      else
        #handle not saving probably by flash notification
      end
    end
  end
end
