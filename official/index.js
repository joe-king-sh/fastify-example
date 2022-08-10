import Fastify from 'fastify'
import {firstRoute} from './our-first-route.js'
import {dbConnector} from './our-db-connector.js'

const fastify = Fastify({
  logger:true
})

fastify.register(dbConnector)
fastify.register(firstRoute)

// 1.ローカルでmongo動かしたい
// 2.TypeScriptサポートを入れる

const  start = async () => {
  try {
    await fastify.listen({port:3000})
  } catch(err){
    fastify.log.error(err)
    process.exit(1)
  }
}
start()