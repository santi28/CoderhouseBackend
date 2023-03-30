/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const CartItem = (product) => {
  const { _id, name, price, quantity, image } = product

  const $template = document.createElement('template')

  $template.innerHTML = `
    <article class="flex overflow-hidden border rounded-lg border-zinc-300">
      <img class="object-cover h-20 aspect-square" src="${image}" alt="">
      <div class="flex flex-col w-full p-2">
        <div class="flex justify-between w-full">
          <h2 class="text-base font-semibold">${name}</h2>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
              <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <span class="text-sm text-zinc-600">$${price} · ${quantity}</span>
        <span class="text-sm text-zinc-600">Subtotal: $${price * quantity}</span>
      </div>
    </article>
  `
  return $template.content.firstElementChild
}

const makeOrder = async (sessionId) => {
  const cart = JSON.parse(sessionStorage.getItem('cart')) || []
  const orderPayload = {
    userId: sessionId,
    products: cart
  }

  const fetchedOrder = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderPayload)
  })

  if (!fetchedOrder.ok) return alert('Error al crear la orden')
  const order = await fetchedOrder.json()

  sessionStorage.removeItem('cart')
  window.location.href = `/orders/${order._id}`
}

const renderCart = () => {
  const $cart = document.querySelector('#cart')
  const cart = JSON.parse(sessionStorage.getItem('cart')) || []

  $cart.innerHTML = ''

  cart.forEach((product) => {
    const $cartItem = CartItem(product)
    $cart.appendChild($cartItem)
  })

  const subtotal = cart.reduce((acc, product) => acc + product.price * product.quantity, 0)
  const $subtotal = document.querySelector('#subtotal')
  $subtotal.innerHTML = `$${subtotal}`
}

const addToCart = async (productId) => {
  const cart = JSON.parse(sessionStorage.getItem('cart')) || []

  const fetchedProduct = await fetch(`/api/products/${productId}`)
  const product = await fetchedProduct.json()

  const isProductInCart = cart.find((item) => item._id === product._id)

  // Si el producto no está en el carrito, lo agregamos con cantidad 1
  if (!isProductInCart) cart.push({ ...product, quantity: 1 })

  // Si el producto ya está en el carrito, aumentamos la cantidad en 1
  if (isProductInCart) {
    cart.map((item) => {
      if (item._id === product._id) item.quantity += 1
      return item
    })
  }

  sessionStorage.setItem('cart', JSON.stringify(cart))
  renderCart()
}

renderCart()
