class LeaveANoteNotesController < ApplicationController
  def index
    @title = 'Leave A Note'
    @notes = LeaveANoteNote.order('created_at DESC').limit(3)
  end

  def create
    content = params[:leave_a_note_note][:content]
    if content && !content.blank?
      content.strip!
      note = LeaveANoteNote.new(:content => content)
      if note.save
        redirect_to :action => :index
      else
        #handle not saving probably by flash notification
      end
    end
  end

end
