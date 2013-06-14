class ViewGraph::ViewsController < ApplicationController
  before_filter :log_view, :only => [:index]

  def index
    @title = 'View Graph'
    @views = ViewGraphView.find(:all)
  end

  def log_view
    x = rand() * 98
    y = rand() * 98
    ViewGraphView.create(:x => x, :y => y)
  end
end
