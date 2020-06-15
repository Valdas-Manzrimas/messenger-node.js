login = () => {
    let userName = document.querySelector('#username').value;
    let password = document.querySelector('#password').value;

    let body = {
        userName,
        password
    }

    fetch('http://localhost:4000/v1/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then((res) => {
        if (!res.ok) {
            throw res;
        }
        localStorage.setItem('x-auth-msg', res.headers.get('x-auth-msg'));
        return res.json();
    }).then((res) => {
        localStorage.setItem('appName-user', JSON.stringify(res));
        window.location.href = '/frontend'
    }).catch(async (e) => {
        console.log(await e.json())
    })
}