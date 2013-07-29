class Todo::TodosController < ApplicationController
  respond_to :json, :html

  def index
    @title = 'To Do'
    if current_user
      @todos = current_user.todo_todos.order('created_at ASC') 
    end
  end

  def destroy
    todo = TodoTodo.find(params[:id])

    todo.destroy if todo.user == current_user
    render :nothing => true
  end

  def create
    current_user.todo_todos.create(params[:todo]) if current_user
    render :nothing => true    
  end
end
