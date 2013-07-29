var TodoTodosIndexListView = Backbone.View.extend({

	initialize: function () {
		this.render();

		this.collection.on('add', this.render, this);
		this.collection.on('remove', this.render, this);
	},

	render: function () {
		this.$el.html('');
		
		this.collection.each(function (todo) {
			this.renderTodo(todo);
		}, this);
	},

	renderTodo: function (todo) {
		var todo_view = new TodoTodosIndexTodoView({
			tagName: 'li',
			model: todo
		});

		this.$el.append(todo_view.render().el);
	}
});