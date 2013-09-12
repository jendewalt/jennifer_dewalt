var BbRouter = Backbone.Router.extend({
	routes: {
		'todo/todos': 'index',
		'taste/entries': 'index'
	},

	index: function () {
		var todoTodosIndexView = new TodoTodosIndexView({ el: '#todos_index_container' });
		var tasteEntriesIndexView = new TasteEntriesIndexView({ el: '#entries_index_container' });
	}
});

new BbRouter();

$(document).ready(function () {
	Backbone.history.start({pushState: true});
});