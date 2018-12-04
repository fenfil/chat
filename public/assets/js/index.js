document.getElementById('btn').addEventListener('click', function() {
  let username = document.getElementById('name').value;
  let room = document.getElementById('room').value;
  
  location.replace(`http://${location.host}/chat?room=${room}&username=${username}`); 
});