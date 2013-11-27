module Blockchain
  require 'rest_client'

  def get_blocks()
    url = 'https://blockchain.info/blocks/?format=json'
    data = JSON.parse(RestClient.get url, :accept => :json).with_indifferent_access
  end

  # def get_block_details(query) {
  # Get more info via search by hash maybe?
  # }

end