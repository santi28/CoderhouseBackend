// Tomando con base el proyecto que vamos realizando, agregar un parámetro más en
// la ruta de comando que permita ejecutar al servidor en modo fork o cluster. Dicho
// parámetro será 'FORK' en el primer caso y 'CLUSTER' en el segundo, y de no
// pasarlo, el servidor iniciará en modo fork.
// ● Agregar en la vista info, el número de procesadores presentes en el servidor.
// ● Ejecutar el servidor (modos FORK y CLUSTER) con nodemon verificando el número de
// procesos tomados por node.
// ● Ejecutar el servidor (con los parámetros adecuados) utilizando Forever, verificando su
// correcta operación. Listar los procesos por Forever y por sistema operativo.

const minimist = require('minimist')

const args = minimist(process.argv.slice(2), {
  alias: {
    p: 'port',
    m: 'mode'
  },
  default: {
    port: 8080,
    mode: 'FORK'
  }
})

const config = {
  args,
  port: args.port,
  mode: args.mode,
  isFork: args.mode === 'FORK',
  isCluster: args.mode === 'CLUSTER'
}

module.exports = {
  apps: [
    {
      name: 'server',
      script: './src/server.js',
      exec_mode: config.isFork ? 'fork' : 'cluster',
      instances: config.isFork ? 1 : 'max',
      watch: true,
      env: {
        PORT: config.port,
        MODE: config.mode
      }
    }
  ]
}
