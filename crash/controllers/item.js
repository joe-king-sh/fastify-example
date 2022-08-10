const {v4:uuidv4} = require('uuid')
const { ModuleKind } = require('typescript')
let items = require('../Items')

const getItems = (req, reply) => {
  reply.send(items)
}

const getItem = (req, reply) => {
  const {id} = req.params
  const item = items.find((item) => item.id === id)

  reply.send(item)
}

const addItem = (req, reply) => {
  const { name } = req.body
  const item = {
    id: uuidv4(),
    name
  }

  items = [...items, item]
  reply.code(201).send(item)
}

const deleteItem = (req, reply) => {
  const { id } = req.params
  console.log(id,items)
  items = items.filter(item => item.id !== id)
  reply.send({message: `The item ${id} has been deleted.`})
}

const updateItem = (req, reply) => {
  const { id } = req.params
  const { name } = req.body
  const updatedItem = {
    id,
    name
  }

  items = items.map(item => item.id === id ? updatedItem: item)
  reply.code(200).send(updatedItem)
}

module.exports = {
  getItems,
  getItem,
  addItem,
  updateItem,
  deleteItem
}