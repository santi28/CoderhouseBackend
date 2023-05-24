/* eslint-disable no-undef */
const CartItem = (product) => {
  const { name, price, quantity, image } = product

  const $template = document.createElement('template')

  $template.innerHTML = `
    <article class="flex overflow-hidden border rounded-lg border-zinc-300">
      <img class="object-cover h-20 aspect-square" src="${image}" alt="">
      <div class="flex flex-col w-full p-2">
        <div class="flex justify-between w-full">
          <h2 class="text-base font-semibold">${name}</h2>
        </div>
        <span class="text-sm text-zinc-600">$${price} · ${quantity}</span>
        <span class="text-sm text-zinc-600">Subtotal: $${price * quantity}</span>
      </div>
    </article>
  `
  return $template.content.firstElementChild
}

const renderCart = () => {
  const $cart = document.querySelector('#cart')
  const cart = JSON.parse(sessionStorage.getItem('cart')) || []

  $cart.innerHTML = ''

  cart.forEach((product) => {
    const $cartItem = CartItem(product)
    $cart.appendChild($cartItem)
  })
}

renderCart()
sessionStorage.setItem('cart', JSON.stringify([]))
