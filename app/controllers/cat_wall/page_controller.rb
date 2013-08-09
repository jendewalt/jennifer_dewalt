class CatWall::PageController < ApplicationController
  def index
    @title = "Cat Wall"

    # client = YouTubeIt::Client.new(:dev_key => YouTubeITConfig.dev_key)
    # videos = client.videos_by(:query => 'cats', :max_results => 1).to_json

    # @video_urls = videos.videos.map do |video|
    #   { video_url: video }
    # end

    # logger.debug(video_urls)
    # logger.debug('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')

    # respond_to do |format|
    #   format.html
    #   format.json { render json: @videos }
    # end
  end
end
