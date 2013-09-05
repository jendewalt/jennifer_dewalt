class Commerce::ItemsController < ApplicationController
  def index
    @title = "Commerce"
  end

  def create
    keyword = params[:keyword]
    keyword = keyword.blank? ? ' ' : keyword
    products = get_products(keyword)

    respond_to do |format|
      format.html
      format.json { render :json => products }
    end   
  end

  def get_products(keyword)

    response = Amazon::Ecs.item_search(keyword, {
      :search_index => 'All', 
      :response_group => 'Large',
      :merchant_id => 'All',
      :item_page => rand(4) + 1
    })

    products = Array.new
    products.push({'error' => response.error})

    response.items.each do |item|
      info = Hash.new
      image_info = item.get_element('LargeImage')
      availability = item.get_element('AvailabilityAttributes')
      item_attributes = item.get_element('ItemAttributes')

      unless image_info.nil? or availability.nil? or item_attributes.nil?
        info['image'] = image_info.get('URL')
        info['availability'] = availability.get('AvailabilityType')
        info['title'] = item_attributes.get('Title')
        info['url'] = item.get('DetailPageURL')
        products.push(info)
      end
    end
    return products
  end
end
