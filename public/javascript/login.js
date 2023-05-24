/* eslint-disable no-undef */
const loginForm = document.querySelector('form')

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  const loginPayload = JSON.stringify({
    email,
    password
  })

  const data = await fetch('/api/accounts/login', {
    method: 'POST',
    body: loginPayload,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  })

  console.log(data.json())
  if (!data.ok) return alert('Se produjo un error al iniciar sesión')

  window.location.href = '/'
})
