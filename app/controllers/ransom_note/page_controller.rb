class RansomNote::PageController < ApplicationController
  def index
    @title = "Ransom Note"
  end

  def create
    note = params[:note]
    @char_urls = []
    valid_chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    valid_nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

    note.each do |char| 
        char = char.downcase
        if valid_chars.include? char
            list = flickr.groups.pools.getPhotos(:group_id => '27034531@N00', :tags => char)

            image = list[rand(list.length - 1)]
            farm_id = image['farm'].to_s
            server_id = image['server'].to_s
            photo_id = image['id'].to_s
            secret = image['secret'].to_s

            @char_urls.push('http://farm' + farm_id + '.staticflickr.com/' + server_id + '/' + photo_id + '_' + secret + '_' + 't.jpg')
        elsif valid_nums.include? char
            list = flickr.groups.pools.getPhotos(:group_id => '54718308@N00', :tags => char)
            
            image = list[rand(list.length - 1)]
            farm_id = image['farm'].to_s
            server_id = image['server'].to_s
            photo_id = image['id'].to_s
            secret = image['secret'].to_s

            @char_urls.push('http://farm' + farm_id + '.staticflickr.com/' + server_id + '/' + photo_id + '_' + secret + '_' + 't.jpg')
        else 
            @char_urls.push('/assets/ransom_space.png')
        end
    end

    respond_to do |format|
      format.html
      format.json { render :json => @char_urls }
    end

  end
end
