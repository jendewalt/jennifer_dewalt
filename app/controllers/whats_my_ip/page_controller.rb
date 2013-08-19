class WhatsMyIp::PageController < ApplicationController
  def index
    @title = 'What\'s My IP Address?'
    @ip = request.remote_ip
    @request = request
  end
end
