class ApplicationController < ActionController::Base
  protect_from_forgery

  after_filter :store_location

  def store_location
    # store last url as long as it isn't a /users path
    unless request.fullpath =~ /\/users\/sign_in/ || request.fullpath =~ /\/users\/sign_up/
      session[:previous_url] = request.fullpath 
    end
  end

  def after_sign_in_path_for(resource)
    session[:previous_url] || root_path
  end

  def after_sign_up_path_for(resource)
    session[:previous_url] || root_path
  end
end
