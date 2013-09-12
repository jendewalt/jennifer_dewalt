var TasteEntriesCollection = Backbone.Collection.extend({
	model: TasteEntry,

	url: 'taste/entries'
});