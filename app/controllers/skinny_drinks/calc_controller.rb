class SkinnyDrinks::CalcController < ApplicationController
  def index
    @title = 'Skinny Drinks'
    @user = current_user
  end
end
