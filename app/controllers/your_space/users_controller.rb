class YourSpace::UsersController < ApplicationController
  before_filter :authenticate_user!, :only => [:edit, :new, :update]

  def new
    @title = YourSpace
  end

  def edit
    @title = YourSpace
    @user = User.find(params[:id])
  end

  def update
    name = params[:user][:name]

    if name.blank? 
      flash[:notice] = "Name Cannot Be Blank!"
      redirect_to :back
    else
      User.find(params[:id]).update_attributes(params[:user])

      redirect_to :action => :show
    end
  end

  def index
    @title = YourSpace
    @users = User.limit(100).order('created_at DESC')
  end

  def show
    @title = YourSpace
    @user = User.find(params[:id])
  end

end
