var TasteEntriesIndexListView = Backbone.View.extend({

	initialize: function () {
		this.render();

		this.collection.on('add', this.render, this);
		this.collection.on('remove', this.render, this);
	},

	render: function () {
		this.$el.html('');

		this.collection.each(function (entry) {
			this.renderEntry(entry);
		}, this);
	},

	renderEntry: function (entry) {
		var entry_view = new TasteEntriesIndexEntryView({
			tagName: 'li',
			model: entry
		});

		this.$el.append(entry_view.render().el);
	}
});