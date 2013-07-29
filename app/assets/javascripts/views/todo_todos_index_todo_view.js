var TodoTodosIndexTodoView = Backbone.View.extend({
	events: {
		'click .delete': 'remove'
	},

	render: function () {
		this.$el.html(render('todo_todos/todo', this.model));

		return this;
	},

	remove: function () {
		this.model.destroy();
	}
});