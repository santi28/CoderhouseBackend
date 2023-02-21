/* eslint-disable no-undef */
const loginForm = document.querySelector('form')

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  if (!email || !password) return alert('Please fill in all fields')

  const loginPayload = JSON.stringify({
    email,
    password
  })

  const data = await fetch('/api/accounts/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: loginPayload,
    credentials: 'include'
  })

  console.log(data)

  if (!data.ok) return alert('Se produjo un error al iniciar sesión')

  // window.location.href = '/'
})
