/* eslint-disable no-undef */
const registerForm = document.querySelector('form')

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const registerPayload = new FormData(registerForm)

  console.log(registerPayload)

  const data = await fetch('/api/accounts/register', {
    method: 'POST',
    body: registerPayload
  })

  const result = await data.json()

  if (result.error) return alert(result)

  location.href = '/login'
})
