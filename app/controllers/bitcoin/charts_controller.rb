class Bitcoin::ChartsController < ApplicationController
  include Blockchain

  def index
    @title = 'Bitcoin Charts'

    @blocks = get_blocks().to_json
  end
end
