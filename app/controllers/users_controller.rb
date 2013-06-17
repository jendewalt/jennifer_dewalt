class UsersController < ApplicationController
  before_filter :authenticate_user!, :except => [:show]
  before_filter :admin_user, :only => [:index]

  def index
  end

  def show
  end

  def destroy
    @user = User.find(params[:id])
    if current_user == @user
      flash[:notice] = "You can't delete yourself! You're an admin, what's wrong with you?  Pull yourself together."
    else
      @user.destroy
      flash[:success] = "User destroyed"
    end
    redirect_to users_path
  end

  private
    
    def admin_user
      redirect_to(root_path) unless current_user.admin?
    end
end
