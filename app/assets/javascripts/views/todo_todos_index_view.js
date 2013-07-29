var TodoTodosIndexView = Backbone.View.extend({

	initialize: function () {
		this.initial_data = $('#data').data('response');
		this.collection = new TodoTodosCollection(this.initial_data);
		
		this.render();

		this.todo_todos_index_list_view = new TodoTodosIndexListView({
			el: '#todos_list',
			collection: this.collection
		});

		this.todo_todos_index_form_view = new TodoTodosIndexFormView({
			el: '#todo_form',
			collection: this.collection
		});
	},

	render: function () {
		this.$el.html('');
		this.$el.html(render('todo_todos/index', {}));
	}

});