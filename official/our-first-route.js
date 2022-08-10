export const firstRoute = async (fastify, options) => {
  const collection =  fastify.mongo.db.collection('test_collection')

  fastify.get('/', async (request, reply) => {
    return {hello:'world'}
  })

  fastify.get('/animals', async (request, reply) => {
    const result = await collection.find({}).toArray()
    // if (result.length === 0) {
    //   throw new Error('No documents found')
    // }
    return result
  })

  fastify.get('/animals/:id', async (request, reply) => {
    const result = await collection.findOne({ animal: request.params.animal }).toArray()
    if (!result) {
      throw new Error('Document not found')
    }
    return result
  })

  const animalBodyJsonSchema = {
    type: 'object',
    required: ['animal'],
    properties: {
      animal: {type: 'string'},
    }
  }

  const schema = {
    body:animalBodyJsonSchema
  }

  fastify.post('/animals', { schema }, async (request, reply) => {
    const result = await collection.insertOne({ animal: request.body.animal })
    return result
  })

}
