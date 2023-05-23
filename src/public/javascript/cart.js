const CartEmptyState = () => {
  const $template = document.createElement('template')

  $template.innerHTML = `
    {{!-- Cart Empty State --}}
    <div class="flex flex-col items-center justify-center w-full gap-2">
      <img class="object-cover w-24 h-24" src="/images/empty-cart.svg" alt="">
      <p class="text-sm text-center text-zinc-600">Tu carrito está vacío</p>
    </div>
  `

  return $template.content.firstElementChild
}

const CartItem = (productItem) => {
  const { product, quantity } = productItem
  const { _id, title, price, images } = product
  const subtotal = price * quantity

  const $template = document.createElement('template')

  $template.innerHTML = `
    <article class="flex overflow-hidden border rounded-lg border-zinc-300">
      <img class="hidden object-cover h-24 aspect-square lg:block" src="${images[0]}" alt="">
      <div class="flex flex-col w-full p-2">
        <div class="flex items-start justify-between w-full">
          <h2 class="py-1 text-base font-semibold">${title}</h2>
          <button class="p-1 rounded-md hover:bg-neutral-200" onClick="deleteProduct('${_id}')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
              <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <span class="text-sm text-zinc-600">$${price} x ${quantity}</span>
        <span class="text-sm text-zinc-600">Subtotal: $${subtotal}</span>
      </div>
    </article>
  `

  return $template.content.firstElementChild
}

const Cart = (products) => {
  const $template = document.createElement('template')

  $template.innerHTML = `
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-2">
        ${products.map((product) => CartItem(product).outerHTML).join('')}
      </div>
      <hr class="border-t border-zinc-300" />
      <a href="/orders/confirm"
        class="w-full px-4 py-2 text-sm text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-zinc-400 disabled:border disabled:border-zinc-300">
        Realizar pedido
      </a>
    </div>
  `
  return $template.content.firstElementChild
}

function addProduct (product, quantity = 1) {
  const productId = product.trim()

  fetch('/api/carts', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ productId, quantity })
  }).then(() => renderCart())
}

function deleteProduct (productId) {
  fetch(`/api/carts/${productId}`, {
    method: 'DELETE',
    credentials: 'include'
  }).then(() => renderCart())
}

async function renderCart () {
  const data = await fetch('/api/carts', { credentials: 'include' })
  const cart = await data.json()

  const $cartContent = document.querySelector('#cart-content')

  console.log(cart)

  if (!cart || cart.products.length <= 0) {
    $cartContent.innerHTML = ''
    return $cartContent.appendChild(CartEmptyState())
  }

  $cartContent.innerHTML = ''
  $cartContent.appendChild(Cart(cart.products))
}

renderCart()
