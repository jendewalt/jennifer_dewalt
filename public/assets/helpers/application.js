function render(template_path, data){
	return JST['templates/' + template_path](data);
}
;
