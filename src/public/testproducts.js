const productItem = ({
  picture,
  name,
  price,
  description
}) => `<li class='flex gap-5 pt-3 pb-3 border-b'>
<img
  class='w-64 h-32 object-cover rounded-lg'
  src='${picture}'
  alt='${name}'
/>
<div class='flex flex-col w-full'>
  <div class='flex items-end gap-3'>
    <h2 class='text-xl'>${name}</h2>
    <span class='text-sm italic text-zinc-600'>$${price}</span>
  </div>
  <p>${description}</p>
</div>
</li>`

const productList = document.getElementById('product-list')

;(async () => {
  const response = await fetch('/api/products/test')
  const products = await response.json()

  const productsHtml = products.map((product) => productItem(product)).join('')

  productList.innerHTML = productsHtml
})()
