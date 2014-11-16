# [11/15/2014] I added pagination to view all of the Little Dudes :)
# To see the original code from 180 Websites, check out 
# commit bc9bb05faa08fb6e49cbcfb8fceee3bb46b600cc

class MakeADude::DudesController < ApplicationController
  def index
    @title = "Make A Dude"
    @dudes = MakeADudeDude.order('created_at DESC').page(params[:page]).per(100)
  end

  def new 
    @title = "Make A Dude"
    @dude = MakeADudeDude.new
  end

  def create
    name = params[:make_a_dude_dude][:name]
    message = params[:make_a_dude_dude][:message]
    color = params[:make_a_dude_dude][:color]
      
    dude = MakeADudeDude.new(:name => name, :message => message, :color => color)
    if dude.save
      redirect_to :action => :index
    else
      #handle not saving probably by flash notification
    end
  end
end
