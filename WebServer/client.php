<div id="messageHolder">
</div>
<input id="inputField">
<button onclick="socket.send(inputField.value); inputField.value = null">Send</button>

<script>
	let socket = new WebSocket("ws://206.83.41.24:8080/", "echo-protocol");

	socket.onopen = function(e) {
	  console.log("[open] Connection established");
	  console.log("Sending to server");
	  socket.send("I joined the chat!");
	};

	socket.onmessage = function(event) {
	  console.log(`[message] Data received from server: ${event.data}`);
	  addMessage(JSON.parse(event.data));
	};

	socket.onclose = function(event) {
	  if (event.wasClean) {
	    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
	  } else {
	    // e.g. server process killed or network down
	    // event.code is usually 1006 in this case
	    console.log('[close] Connection died');
	  }
	};

	socket.onerror = function(error) {
	  console.log(`[error] ${error.message}`);
	};


	function addMessage(_message) {
		let html = document.createElement("div");;

		setTextToElement(html, _message.senderId + ": " + _message.message);
		messageHolder.append(html);
	}


	function setTextToElement(element, text) {
		element.innerHTML = "";
		let a = document.createElement('a');
		a.text = text;
		element.append(a);
	}
</script>