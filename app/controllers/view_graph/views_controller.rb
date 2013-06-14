class ViewGraph::ViewsController < ApplicationController
  before_filter :log_view, :only => [:index]

  def index
    @title = 'Page View Graph'
    @views = ViewGraphView.find(:all, :order => "id desc", :limit => 1000).reverse
  end

  def log_view
    x = rand() * 98
    y = rand() * 98
    new_view = ViewGraphView.create(:x => x, :y => y).id()

    if new_view > 1000
      ViewGraphView.destroy(new_view - 1000)
    end
  end
end
