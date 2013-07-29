var TodoTodosIndexFormView = Backbone.View.extend({

	events: {
		'submit': 'handleSubmit'
	},

	handleSubmit: function (e) {
		e.preventDefault();
		var title = e.target[0].value;
		var description = e.target[1].value;
		e.target[0].value = '';
		e.target[1].value = '';
		
		var new_todo = new TodoTodo({
			title: title,
			description: description
		});

		new_todo.save();

		this.collection.add(new_todo);
	}

});