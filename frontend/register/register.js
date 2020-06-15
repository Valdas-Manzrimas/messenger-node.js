register = () => {
    let userName = document.querySelector('#username').value;
    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;
    let rPassword = document.querySelector('#rPassword').value;

    console.log(userName, email, password, rPassword)

    if (password != rPassword) return 'Passwords do not match';

    let body = {
        userName,
        email,
        password
    }

    fetch('http://localhost:4000/v1/user/register', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then((res) => {
        if (!res.ok) {
            throw res;
        };
        return res.json()
    }).then((res) => {
        window.location.href = '/frontend/login';
    }).catch(async (e) => {
        console.log(await e.json())
    })

}