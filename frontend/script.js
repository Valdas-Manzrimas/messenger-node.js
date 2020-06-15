const logoutBtn = document.querySelector('#logOut');
const submitChannelName = document.querySelector('#addNewChannelContainer');
const addUserInToChannel = document.querySelector('#addNewUserContainer');
const sendMessage = document.querySelector('#sendMessageBtn');

let token;
let channelId;
let allUsers;

document.addEventListener(
  'DOMContentLoaded',
  function () {
    token = localStorage.getItem('x-auth-msg');
    if (!token) {
      window.location.href = '/frontend/login';
    } else {
      JSON.parse(localStorage.getItem('appName-user'));
      changeNavBarInfo();
      changeSideBarInfo();
      getAllChannels();
      getAllChannelUsers();
      selectChannel();
      getAllMessages();
    }
  },
  false
);

logOut = () => {
  fetch('http://localhost:4000/v1/user/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-msg': token,
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then((response) => {
      localStorage.removeItem('x-auth-msg');
      window.location.href = '/frontend/login';
    })
    .catch(async (e) => {
      console.log(await e.json());
    });
};

changeNavBarInfo = () => {
  let emailElem = document.querySelector('#userName');

  let userObject = JSON.parse(localStorage.getItem('appName-user'));

  emailElem.innerHTML = userObject.email;
};

changeSideBarInfo = () => {
  let usernameEl = document.querySelector('#sideUserName');

  let userObject = JSON.parse(localStorage.getItem('appName-user'));

  usernameEl.innerHTML = userObject.userName;
};

createChannel = async (e) => {
  event.preventDefault(e);

  let title = document.querySelector('#channelName').value;
  if (!title) return;

  let body = {
    title,
  };
  try {
    let res = await fetch('http://localhost:4000/v1/createChannel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-msg': token,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw res.json();
    submitChannelName.style.display = 'none';
    getAllChannels();
  } catch (e) {
    console.log(e);
  }
};

getAllChannels = async () => {
  try {
    let channels = await fetch('http://localhost:4000/v1/getAllChannels', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-msg': token,
      },
    });
    if (!channels.ok) throw channels.json();
    channels = await channels.json();

    await drawItemsInList(channels);
  } catch (e) {
    console.log(await e);
  }
};

drawItemsInList = (channels) => {
  return new Promise((res) => {
    let list = document.querySelector('#itemsList');
    list.innerHTML = '';
    for (let i = 0; i < channels.length; i++) {

      let li = document.createElement('li');
      li.className = 'sideBar-list-item';
      if (channels[i].checked) li.classList.add('checked')
      li.addEventListener('click', () => {
        selectChannel(li, channels[i])
      })

      let div = document.createElement('div');
      div.className = 'innerLi';
      div.innerHTML = channels[i].title;

      li.appendChild(div);

      let span = document.createElement('span');
      span.className = 'badge';
      span.innerHTML = 'X';
      span.addEventListener('click', () => {
        deleteChannel(channels[i]._id);
      });
      li.appendChild(span);
      list.appendChild(li);
    }
  });
};

selectChannel = async (el, id) => {

  if (el.classList.contains('checked')) {
    el.classList.remove('checked')
  } else {
    el.classList.add('checked')
  }

  channelId = id._id;
  allUsers = id;

  try {
    let response = await fetch(`http://localhost:4000/v1/toogleChannel/${channelId}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        "x-auth-msg": token
      }
    })
    if (!response.ok) throw response;
  } catch (e) {
    console.log(e)
  }
}

deleteChannel = async (id) => {
  try {
    let response = await fetch(`http://localhost:4000/v1/deleteChannel/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-node': token,
      },
    });
    if (!response.ok) throw response;
    getAllChannels();
  } catch (e) {
    console.log(e);
  }
};

addUserToChannel = async (e) => {
  event.preventDefault(e);

  let user = document.querySelector('#userNameInput').value;
  if (!user) return;

  let body = {
    user,
    channelId
  };

  console.log(body)
  try {
    let res = await fetch('http://localhost:4000/v1/addUserToChannel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-msg': token,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw res.json();
    addNewUserContainer.style.display = 'none';
    getAllChannelUsers();
  } catch (e) {
    console.log(e);
  }
}

getAllChannelUsers = async () => {
  try {
    let users = await fetch('http://localhost:4000/v1/getAllChannelUsers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-msg': token,
      },
    });

    if (!users.ok) throw users.json();
    users = await users.json({
      users: userName
    });
    console.log(users)
    let allUsers = users.allUsers;
    await drawUsersInList(allUsers);
  } catch (e) {
    console.log(await e);
  }
};

drawUsersInList = (allUsers) => {
  return new Promise((res) => {
    let list = document.querySelector('#userList');
    list.innerHTML = '';
    for (let i = 0; i < allUsers.length; i++) {

      let li = document.createElement('li');
      li.className = 'sideBar-list-item';
      if (allUsers[i].checked) li.classList.add('checked')
      li.addEventListener('click', () => {
        selectChannel(li, allUsers[i])
      })

      let div = document.createElement('div');
      div.className = 'innerLi';
      div.innerHTML = allUsers[i].userName;

      li.appendChild(div);

      let span = document.createElement('span');
      span.className = 'badge';
      span.innerHTML = 'X';
      span.addEventListener('click', () => {
        deleteUserFromChannel(allUsers[i]._id);
      });
      li.appendChild(span);
      list.appendChild(li);
    }
  });
}

deleteUserFromChannel = async (id) => {

  let body = {
    user: id,
    channelId,
    allUsers: id
  };
  // allUsers = allUsers.id
  console.log(body)
  try {
    let response = await fetch(`http://localhost:4000/v1/deleteUserFromChannel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-msg': token,
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) throw response;

    getAllChannelUsers();
  } catch (e) {
    console.log(e);
  }
};

createMessage = async () => {
  let message = document.querySelector('#messageInput').value;

  let body = {
    message,
    channelId,

  }
  console.log(body)

  try {
    let response = await fetch('http://localhost:4000/v1/createMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-msg': token
      },
      body: JSON.stringify(body)
    })
    console.log(response)

    if (!response.ok) throw response.json();
    message = '';
  } catch (e) {
    console.log(e)
  }
}

getAllMessages = async () => {
  try {
    let messages = await fetch(`http://localhost:4000/v1/getAllMessages/${channelId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-msg': token
      }
    })
    if (!messages.ok) throw messages.json();
    messages = await messages.json();
    console.log(messages[0].message)
    await showMessagesOnScreen(messages);
  } catch (e) {
    console.log(await e)
  }
}

showMessagesOnScreen = (messages) => {
  return new Promise((resolve) => {
    let list = document.querySelector('#chatContent')
    list.innerHTML = '';
    for (let i = 0; messages.length; i++) {
      list.innerHTML = messages[i].message
    }
  })
}

logoutBtn.addEventListener('click', logOut);
submitChannelName.addEventListener('submit', createChannel);
addUserInToChannel.addEventListener('submit', addUserToChannel);
sendMessage.addEventListener('click', createMessage);