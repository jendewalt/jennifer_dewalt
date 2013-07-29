var TodoTodosCollection = Backbone.Collection.extend({
	model: TodoTodo,

	url: 'todo/todos'
});