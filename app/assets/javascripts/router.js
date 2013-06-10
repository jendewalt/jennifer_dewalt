$(document).ready(function () {
	var routes = {
		"click_counter_buttons": clickCounter
	}
	var route = window.location.pathname.replace(/^\//, '').replace(/\/.*/, '');
	routes[route]();
});