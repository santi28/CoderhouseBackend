// eslint-disable-next-line no-undef
const socket = io()
const productForm = document.querySelector('#product-form')
const productList = document.querySelector('#product-list')

const Product = (title, price, thumbnail) => {
  const article = document.createElement('article')
  article.innerHTML = `
    <img class="object-cover w-full mb-2 rounded-lg aspect-video" src="${thumbnail}" alt="${title}"> 
    <h3 class="text-lg">${title}</h3> 
    <span class="italic text-zinc-500">$${price}</span>
  `

  return article
}

socket.on('productos', (data) => {
  const productContainer = document.getElementById('productContainer')
  data.map(({ name, price, picture }) =>
    productContainer.appendChild(Product(name, price, picture))
  )
})

productForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const name = document.getElementById('title').value
  const price = document.getElementById('price').value
  const picture = document.getElementById('thumbnail').value

  socket.emit('new-product', { name, price, picture })
})

socket.on('update-products', (data) => {
  console.log(data)

  // data = data[0]
  productList.appendChild(Product(data.name, data.price, data.picture))
})
