class TypingTest::TestsController < ApplicationController
  def index
    @title = 'Typing Test'
    @user = current_user
  end
end
