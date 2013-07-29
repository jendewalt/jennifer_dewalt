class TodoTodo < ActiveRecord::Base
  attr_accessible :description, :title, :user_id
  belongs_to :user
  validates :user_id, presence: true
end
