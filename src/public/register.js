/* eslint-disable no-undef */
const registerForm = document.querySelector('form')

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const name = registerForm.name.value
  const email = registerForm.email.value
  const password = registerForm.password.value

  if (!name || !email || !password) return alert('Please fill in all fields')

  const registerPayload = JSON.stringify({
    name,
    email,
    password
  })

  console.log(registerPayload)

  const data = await fetch('/api/accounts/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: registerPayload
  })

  const res = await data.json()

  if (res.error) return alert('Se produjo un error al crear la cuenta')

  alert('Account created successfully')
  registerForm.reset()
})
