function salonGalleries() {
	var body = $('body')[0];
	var this_page = window.location.pathname.replace(/\/edit.*$/, '');
	console.log

	if ($('#edit_photo_container').length) {
		body.addEventListener('dragover', function (e) {
			e.preventDefault();
		}, false);	

		body.addEventListener('drop', function (e) {
			e.preventDefault();
			e.stopPropagation();

			var files = e.dataTransfer.files;
			$('#throbber').show();
			checkFiles(files);
			return false
		}, false);

		function checkFiles(files) {
			files = _.reject(files, function (file) {
				return file.type.indexOf('image') == -1;
			});

			uploadFiles(files);
		}

		function uploadFiles(files) {
			var form_data = new FormData();
			var pos = 0;
			var max = files.length;
			var gallery_title = $('input.title').val();

			if (typeof form_data != 'undefined') {
				function queue() {
					var file = files[pos];

					if (max >= 1 && pos <= max - 1) {
						form_data.append('file', file);
						upload();
					} else {
						location.reload();
					}
				}

				function upload() {
					$.ajax({
						url: this_page,
						data: form_data,
						type: 'PUT',
						processData: false,
	              		contentType: false,
						success: function (data) {
							pos += 1;
							queue();
						},
						error: function () {
							location.reload();
						}
					});
				}

				queue();
			}
		}
	}

}