import fastifyPlugin from 'fastify-plugin'
import fastifyMongo from '@fastify/mongodb'

export const dbConnector = async (fastify, options) => {
  fastify.register(fastifyMongo, {
    url: 'mongodb://localhost:27017/test_database',
  })
}