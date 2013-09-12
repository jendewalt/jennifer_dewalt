var TasteEntriesIndexFormView = Backbone.View.extend({

	events: {
		'submit': 'handleSubmit'
	},

	handleSubmit: function (e) {
		e.preventDefault();
		var name = e.target[0].value;
		var kind = e.target[1].value;
		var rating = e.target[2].value;
		var comments = e.target[3].value;
		var image = e.target[4].value;

		e.target[0].value = '';
		e.target[1].value = '';
		e.target[2].value = '';
		e.target[3].value = '';
		e.target[4].value = '';

		var new_entry = new TasteEntry({
			name: name,
			kind: kind,
			rating: rating,
			comments: comments,
			image: image
		});

		new_entry.save();

		this.collection.add(new_entry);
	}
});