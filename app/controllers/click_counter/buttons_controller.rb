class ClickCounter::ButtonsController < ApplicationController
  def show
    @title = 'Click Counter'
    button_id = params[:id]
    @button = ClickCounterButton.find(button_id)
  end

  def update
    ClickCounterButton.find(params[:id]).increment!(:clicks) 
    render :nothing => true
  end
end
