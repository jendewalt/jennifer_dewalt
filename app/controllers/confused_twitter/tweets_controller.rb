class ConfusedTwitter::TweetsController < ApplicationController
  def index
    @title = 'Confused Twitter'
    results = Twitter.search('confused OR confusing OR confused AND pic.twitter.com', {include_entities: true})
    @tweets = results.statuses.map do |status|
      { text: status.text, img_url: status.attrs[:entities][:media].try(:first).try(:[], :media_url) }
    end

    @tweets.each do |tweet|
      tweet[:text] = tweet[:text].gsub /[@]+\S+/, ''
      tweet[:text] = tweet[:text].gsub /(RT )/, ''
      tweet[:text] = tweet[:text].gsub /(http:\/\/t.co\/)\S+/, ''
      tweet[:text] = tweet[:text].gsub /(&amp;)/, ''

      # [Added 03.04.2016] Change img url to use https
      if tweet[:img_url]
        tweet[:img_url].gsub! /http:/, 'https:'
        logger.debug tweet
      end
    end
  end
end
