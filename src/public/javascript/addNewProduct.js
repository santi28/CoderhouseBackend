/* eslint-disable no-undef */
const form = document.querySelector('form')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const newProductPayload = new FormData(form)

  const data = await fetch('/api/products', {
    method: 'POST',
    body: newProductPayload
  })

  if (!data.ok) return alert('Se produjo un error al crear el producto')
  window.location.href = '/'
})
