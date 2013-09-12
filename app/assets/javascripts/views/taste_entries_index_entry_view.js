var TasteEntriesIndexEntryView = Backbone.View.extend({
	events: {
		'click .delete': 'remove'
	},

	render: function () {
		this.$el.html(render('taste_entries/entry', this.model));

		return this;
	},

	remove: function () {
		this.model.destroy();
	}
});