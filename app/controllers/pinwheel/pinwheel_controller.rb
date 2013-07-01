class Pinwheel::PinwheelController < ApplicationController
  def index
    @title = Pinwheel
    @user = current_user
  end
end
