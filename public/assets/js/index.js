document.getElementById('btn').addEventListener('click', function() {
  let username = document.getElementById('name').value || 'noname';
  let room = document.getElementById('room').value || 'main';

  location.replace(`http://${location.host}/chat?room=${room}&username=${username}`);
});
