class EmergencyOff::ButtonController < ApplicationController
  def index
    @title = 'Emergency Off'
    @user = current_user
  end
end