const items = require("../Items");
const {
  getItems,
  getItem,
  addItem,
  updateItem,
  deleteItem,
} = require("../controllers/item");

// Item schema
const Item = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
  },
};

// Options for get all items
const getItemsOpts = {
  schema: {
    response: {
      200: {
        type: "array",
        items: Item,
      },
    },
  },
  handler: getItems,
};

const getItemOpts = {
  schema: {
    response: {
      200: Item,
    },
  },
  handler: getItem,
};

const postItemOpts = {
  schema: {
    body: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string" },
      },
    },
    response: {
      201: Item,
    },
  },
  handler: addItem,
};

const deleteItemOpts = {
  schema: {
    response: {
      204: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
  handler: deleteItem,
};

const updateItemOpts = {
  schema: {
    body: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string" },
      },
    },
    response: {
      200: Item,
    },
  },
  handler: updateItem,
};

const itemRoutes = (fastify, options, done) => {
  // 第2引数で渡すスキーマ(`getItemsOpts`)で、レスポンスのスキーマを定義できる
  // -> キャストも勝手にやられるのちょっと怖い、実際キャストできないと500エラーを返す
  // handlerもOptionのなかに突っ込める。突っ込まない場合はget()の第3引数に指定する

  // スキーマで最低限のバリデーションまでやってくるのがとても便利、swaggerとバリデーションルールやリクエストレスポンスの型が乖離することがないので安全。
  fastify.get("/items", getItemsOpts);
  fastify.get("/items/:id", getItemOpts);
  fastify.post("/items", postItemOpts);
  fastify.put("/items/:id", updateItemOpts);
  fastify.delete("/items/:id", deleteItemOpts);

  done();
};

module.exports = itemRoutes;
