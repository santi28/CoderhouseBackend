process.on('message', (cant) => {
  const randoms = {}

  for (let i = 0; i < cant; i++) {
    const random = Math.floor(Math.random() * 1000) + 1

    if (randoms[random]) {
      randoms[random]++
    } else {
      randoms[random] = 1
    }
  }

  process.send(randoms)
})
