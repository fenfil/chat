document.getElementById('btn').addEventListener('click', function() {
  let username = document.getElementById('name').value || 'noname';
  let room = document.getElementById('room').value || 'main';

  location.replace(`http://${location.host}/chat?room=${room}&username=${username}`);
});

document.getElementById('room').addEventListener('keypress', (e) => {
  if (e.key == 'Enter') {
    document.getElementById('name').focus();
  }
});

document.getElementById('name').addEventListener('keypress', (e) => {
  if (e.key == 'Enter') {
    document.getElementById('btn').click();
  }
});