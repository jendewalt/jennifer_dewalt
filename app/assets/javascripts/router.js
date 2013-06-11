$(document).ready(function () {
	var routes = {
		"click_counter_buttons": clickCounter,
		"one_page_pages": onePage
	}
	var route = window.location.pathname.replace(/^\//, '').replace(/\/.*/, '');
	routes[route]();
});