let closeBtn = document.querySelector('#closeChannelCont');
let addNewChannelBtn = document.querySelector('#addChannel');

let closeUserBtn = document.querySelector('#closeModelCont');
let addNewUserBtn = document.querySelector('#addUser');

let messageInput = document.querySelector('#messageInput');

messageInput = () => {
  messageInput.contentEditable = 'true';
}

checkTime = (i) => {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
};

currentTime = () => {
  let timeElem = document.querySelector('#currentTime');
  let d = new Date();
  let m = d.getMinutes();
  let h = d.getHours();
  let s = d.getSeconds();

  m = checkTime(m);
  h = checkTime(h);
  s = checkTime(s);

  timeElem.innerHTML = h + ':' + m + ':' + s;
};
setInterval(currentTime, 1000);

closeContainer = () => {
  addNewChannelContainer.style.display = 'none';
};

closeUserContainer = () => {
  addNewUserContainer.style.display = 'none';
};

addChannel = () => {
  addNewChannelContainer.style.display = 'block';
};

addUser = () => {
  addNewUserContainer.style.display = 'block';
};

closeBtn.addEventListener('click', closeContainer);
addNewChannelBtn.addEventListener('click', addChannel);

closeUserBtn.addEventListener('click', closeUserContainer);
addNewUserBtn.addEventListener('click', addUser);