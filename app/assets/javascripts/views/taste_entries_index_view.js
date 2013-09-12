var TasteEntriesIndexView = Backbone.View.extend({

	initialize: function () {
		this.initial_data = $('#data').data('response');
		this.collection = new TasteEntriesCollection(this.initial_data);

		this.render();

		this.taste_entries_index_list_view = new TasteEntriesIndexListView({
			el: '#entries_list',
			collection: this.collection
		});

		this.taste_entries_index_form_view = new TasteEntriesIndexFormView({
			el: '#entry_form',
			collection: this.collection
		});
	},

	render: function () {
		this.$el.html('');
		this.$el.html(render('taste_entries/index', {}));
	}
});