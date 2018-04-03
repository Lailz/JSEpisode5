// Retrieve the high-level elements on the page:
// - The username input field
// - The edit button
// - The new message input field
// - The send message button
// - The list of messages
const usernameInput = document.getElementById("username-input");
const editButton = document.getElementById("edit-username-button");
const messageInput = document.getElementById("new-message");
const sendButton = document.getElementById("send-button");
const messages = document.getElementById("messages");
const reloadButton = document.getElementById("reload");

// Add a click handlers to global buttons
sendButton.onclick = sendMessage;
editButton.onclick = editUsername;
reloadButton.onclick = getAllMessages;

setInterval (function(){getAllMessages();}, 5000);
let latest = "hiya";
console.log(latest);
/*******************************************
* Create a new message item:
*
* Generates a new message item using the data
* in the messageObj and prepends it to the
* messages list.
*
* createNewMessage(messageObj);
********************************************/
function createNewMessage(messageObj) {
	let listItem = document.createElement("li"); // Create List Item
	let username = document.createElement("label"); // Label
	let message = document.createElement("p"); // Pragraph

	username.innerText = messageObj.username; // Change the label text to the username
	message.innerText = messageObj.message; // Change the paragraph text to the message

  // Append each element to the listItem
	listItem.appendChild(username);
	listItem.appendChild(message);

	// Prepend the new message to the beginning off the messages area
	messages.insertBefore(listItem, messages.firstChild);
};


/*****************************************************
* Send a new message to the server:
* - Create a messageObj with the following properties:
*			* username
*			* message
* - Use Axios to post that message to the server at:
*			<ip_address>/messages/create/
* - Then add your own message to the page
*		using createNewMessage
* - Don't forget to clear the message input.
*****************************************************/
function sendMessage() {

  let messageObj = {
    username: usernameInput.value,
    message: messageInput.value
  };
  
  axios.post('http://127.0.0.1:8000/messages/create/', {username: messageObj.username, message: messageObj.message})
    .then(response => {
        createNewMessage(messageObj);
    })
    .then(response => {
        messageInput.value = '';
    })
    .catch(error => console.error(error));

};


/*****************************************************
* Retrieve all messages from the server:
* - Use Axios to get all the messages currently
*		on the server at:
*			<ip_address>/messages/
* - Then erase all the current messages
* - Then add each message from the response to the
*		messages area.
*		(you can use createNewMessage to do this)
*****************************************************/
function getAllMessages() {
  
  axios.get('http://127.0.0.1:8000/messages/?latest=' + latest);
    .then(response => response.data)
    .then(data => {
        console.log(data);
        messages.innerHTML = "";
        return data;
     })
    .then(data => {
        data.forEach(function(data){
        createNewMessage(data); 
        return (data.timestamp);});
        
          // [{title: 'Hello AJAX', published: true}, {title: 'Benefits of Machboos' ....
     })
    .catch(error => console.error("error"));
};


/*****************************************************************
* Edit Username:
*
* Edits the current username.
* The username should be sent with every post request.
*****************************************************************/
function editUsername() {
	let usernameSection = this.parentNode;
  let input = usernameSection.querySelector("input[type=text]");
  let label = usernameSection.querySelector("label");
  let button = this;

  if (usernameSection.classList.contains('editMode')) {
    label.innerText = input.value;
    button.innerText = 'Edit';
  } else {
    input.value = label.innerText;
    button.innerText = 'Save';
  }

  usernameSection.classList.toggle('editMode');
};
