class TextToBraille::ConverterController < ApplicationController
  def index
    @title = 'Text to Braille'    
    @user = current_user
  end
end
