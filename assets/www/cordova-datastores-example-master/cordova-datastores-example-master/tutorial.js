// Insert your Dropbox app key here:
var DROPBOX_APP_KEY = 'xoit9j3uwj9vmdv';

// Exposed for easy access in the browser console.
var client = new Dropbox.Client({key: DROPBOX_APP_KEY});
client.authDriver(new Dropbox.AuthDriver.Cordova());
var taskTable;

document.addEventListener("deviceready", function () {
	// Insert a new task record into the table.
	function insertTask(text) {
		taskTable.insert({
			taskname: text,
			created: new Date(),
			completed: false
		});
	}

	// updateList will be called every time the table changes.
	function updateList() {
		$('#tasks').empty();

		var records = taskTable.query();

		// Sort by creation time.
		records.sort(function (taskA, taskB) {
			if (taskA.get('created') < taskB.get('created')) return -1;
			if (taskA.get('created') > taskB.get('created')) return 1;
			return 0;
		});

		// Add an item to the list for each task.
		for (var i = 0; i < records.length; i++) {
			var record = records[i];
			$('#tasks').append(
				renderTask(record.getId(),
					record.get('completed'),
					record.get('taskname')));
		}

		addListeners();
		$('#newTask').focus();
	}

	function auth_callback (error) {
		if (error) {
			alert('Authentication error: ' + error);
			return;
		}
		if (client.isAuthenticated()) {
			// Client is authenticated. Display UI.
			$('#login').hide();
			$('#main').show();

			client.getDatastoreManager().openDefaultDatastore(function (error, datastore) {
				if (error) {
					alert('Error opening default datastore: ' + error);
				}

				taskTable = datastore.getTable('tasks');

				// Populate the initial task list.
				updateList();

				// Ensure that future changes update the list.
				datastore.recordsChanged.addListener(updateList);
			});
		} else {
			$('#login').show();
			$('#main').hide();
		}
	}

	// The login button will start the authentication process.
	$('#loginButton').click(function (e) {
		e.preventDefault();
		// This will redirect the browser to OAuth login.
		client.authenticate(auth_callback);
	});

	// Try to finish OAuth authorization.
	client.authenticate({interactive:false}, auth_callback);

	// Set the completed status of a task with the given ID.
	function setCompleted(id, completed) {
		taskTable.get(id).set('completed', completed);
	}

	// Delete the record with a given ID.
	function deleteRecord(id) {
		taskTable.get(id).deleteRecord();
	}

	// Render the HTML for a single task.
	function renderTask(id, completed, text) {
		return $('<li>').attr('id', id).append(
				$('<button>').addClass('delete').html('&times;')
			).append(
				$('<span>').append(
					$('<button>').addClass('checkbox').html('&#x2713;')
				).append(
					$('<span>').addClass('text').text(text)
				)
			)
			.addClass(completed ? 'completed' : '');
	}

	// Register event listeners to handle completing and deleting.
	function addListeners() {
		$('span').click(function (e) {
			e.preventDefault();
			var li = $(this).parents('li');
			var id = li.attr('id');
			setCompleted(id, !li.hasClass('completed'));
		});

		$('button.delete').click(function (e) {
			e.preventDefault();
			var id = $(this).parents('li').attr('id');
			deleteRecord(id);
		});
	}

	// Hook form submit and add the new task.
	$('#addForm').submit(function (e) {
		e.preventDefault();
		if ($('#newTask').val().length > 0) {
			insertTask($('#newTask').val());
			$('#newTask').val('');
		}
		return false;
	});

	$('#newTask').focus();
}, false);
