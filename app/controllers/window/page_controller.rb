class Window::PageController < ApplicationController
  def index
    @title = "Window"
    
    @img_urls = []

    photos = flickr.photos.search(:tags => 'nature, sky, field, trees', :content_type => 1, :extras => 'url_l')

    photos.each do |image|
      if image['url_l'] and image['height_l'].to_i > 550
        @img_urls.push(image['url_l'])
      end
    end
  end
end
