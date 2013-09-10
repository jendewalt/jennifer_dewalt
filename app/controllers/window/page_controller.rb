class Window::PageController < ApplicationController
  def index
    @title = "Window"
    
    @img_urls = []

    photos = flickr.photos.search(:tags => 'nature, sky, field, trees', :content_type => 1, :extras => 'url_l')

    photos.each do |image|
      # farm_id = image['farm'].to_s
      # server_id = image['server'].to_s
      # photo_id = image['id'].to_s
      # secret = image['secret'].to_s

      if image['url_l'] and image['height_l'].to_i > 550
        @img_urls.push(image['url_l'])
      end
    end

    logger.debug('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    logger.debug(photos.inspect)
    logger.debug('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    logger.debug(@img_urls)
  end
end
