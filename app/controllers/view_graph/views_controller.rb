class ViewGraph::ViewsController < ApplicationController
  before_filter :log_view, :only => [:index]

  def index
    @title = 'Page View Graph'
    @views = ViewGraphView.find(:all, :order => "id desc", :limit => 2000).reverse
  end

  def log_view
    x = rand() * 98
    y = rand() * 98
    new_view = ViewGraphView.create(:x => x, :y => y).id()

    if new_view > 2000
      ViewGraphView.destroy(new_view - 2000)
    end
  end
end
