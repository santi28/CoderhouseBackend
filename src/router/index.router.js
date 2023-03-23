import { fork } from 'child_process'

import appRouter from './app.router.js'
import productsRouter from './products.router.js'
import sessionRouter from './session.router.js'
import cartsRouter from './cart.router.js'

import { Router } from 'express'
const router = Router()

router.use('/', appRouter)
router.use('/api/products', productsRouter)
router.use('/api/accounts', sessionRouter)
router.use('/api/cart', cartsRouter)

// router.get('/api/random', (req, res) => {
//   const { cant } = req.query
//   cant == cant || 100000000

//   res.json({ random: Math.random() })
// })

// Agregar otra ruta '/api/randoms' que permita calcular un cantidad de números aleatorios
// en el rango del 1 al 1000 especificada por parámetros de consulta (query).
// Por ej: /randoms?cant=20000.
// Si dicho parámetro no se ingresa, calcular 100.000.000 números.
// El dato devuelto al frontend será un objeto que contendrá como claves los números
// random generados junto a la cantidad de veces que salió cada uno. Esta ruta no será
// bloqueante (utilizar el método fork de child process). Comprobar el no bloqueo con una
// cantidad de 500.000.000 de randoms.

router.get('/api/randoms', (req, res) => {
  const { cant } = req.query
  const child = fork('./src/utils/randoms.fork.js')

  child.send(cant || 100000000)

  child.on('message', (randoms) => {
    res.json(randoms)
  })

  child.on('exit', () => {
    console.log('Child process exited')
  })

  child.on('error', (err) => {
    console.error(err)
    res.status(500).json({ error: err.message })
  })
})

export default router
