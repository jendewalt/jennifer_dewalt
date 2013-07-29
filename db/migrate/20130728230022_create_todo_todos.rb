class CreateTodoTodos < ActiveRecord::Migration
  def change
    create_table :todo_todos do |t|
      t.string :title
      t.string :description
      t.integer :user_id

      t.timestamps
    end

    add_index :todo_todos, :user_id
  end
end
