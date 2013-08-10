class WordCloud::WordsController < ApplicationController
  def index
    @title = 'Word Cloud'
    @new_words = WordCloudWord.new
    words = WordCloudWord.order('updated_at DESC').limit(100)

    if words.count > 0
      words_by_frequency = words.sort { |a, b| a.count <=> b.count }
      min_frequency = words_by_frequency.first.count
      max_frequency = words_by_frequency.last.count

      min_size = 10
      max_size = 100

      @cloud_words = Hash.new(0)
      words.each do |word|
        if max_frequency - min_frequency == 0
          denom = 1
        else
          denom = max_frequency - min_frequency
        end

        scale = (word.count - min_frequency).to_f / denom
        size = min_size + ((max_size - min_size) * scale).round
        @cloud_words[word.word_text] = size
      end
    end
  end

  def create
    input = params[:word_cloud_word][:word_text]
    if input && !input.blank? && input.length <= 255
      words = input.gsub(/\W+/, ' ').downcase.split(' ')

      words.reverse_each do |word|
        word = WordCloudWord.find_by_word_text(word) || WordCloudWord.new(:word_text => word, :count => 0)
        word.increment!(:count)
      end
    end
    redirect_to :action => :index
  end
end
