var BbRouter = Backbone.Router.extend({
	routes: {
		'todo/todos': 'todo_index',
		'taste/entries': 'taste_index'
	},

	todo_index: function () {
		var todoTodosIndexView = new TodoTodosIndexView({ el: '#todos_index_container' });
	},

	taste_index: function () {
		var tasteEntriesIndexView = new TasteEntriesIndexView({ el: '#entries_index_container' });		
	}
});

new BbRouter();

$(document).ready(function () {
	Backbone.history.start({pushState: true});
});