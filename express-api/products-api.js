const express = require('express')
const app = express()
const port = 3000

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//Default list of products which supposed to be retrieved from BD
const products = [
  { id: 1, naam: 'Monitor', merk: `Samsung`, voorraad: 20, price:120.1},
  { id: 2, naam: 'Monitor', merk: `Accer`, voorraad: 25, price:150.5},
  { id: 3, naam: 'Mac', merk: `Apple`, voorraad: 15, price:1150.15},
  { id: 4, naam: 'PC', merk: `Dell`, voorraad: 34, price:1000.25}
];

//--- HTTP GET: Fetch list of products
 app.get('/api/v1/products', (req, res) => {
  //Get all products from DB

  //res.send('Hello World!')
  //res.json({msg: 'Hello'})
  console.log(`List of products: ${JSON.stringify(products)}`)
  res.json(products)
})

//--- HTTP GET: get product by Id
app.get('/api/v1/product/:id', (req, res) => {

  //TODO: validate id!
  
  console.log(`Product id: ` + req.params.id)
  const  product= findObjectById(products, +req.params.id); //Use '+' to convert string->number
  if (product) {
    res.json(product)
  } else {
    console.log('Product not found');
    return res.status(404).json({error: 'Product not found'});
  }
})

//--- HTTP POST: Add a new product
app.post('/api/v1/products', (req, res) => {
  const product = req.body;

  // TODO: Perform any necessary validation if necessary

  // Example response
  product.id = products.length +1

  products.push(product)
  console.log(`New product has been added: ${JSON.stringify(product)}`)
  res.json({id: product.id});
});

//--- HTTP PUT: Update existing product by id
app.put('/api/v1/products', (req, res) => {
  const product = req.body;

  const  productToUpdate= findObjectById(products, product.id);
  if (productToUpdate) {
    console.log(`Product found: ${JSON.stringify(productToUpdate)}`);
    productToUpdate.naam = product.naam
    productToUpdate.merk = product.merk
    productToUpdate.voorraad = product.voorraad
    productToUpdate.price = product.price
  } else {
    //TODO return an error
    console.log('Product not found');
    return res.status(404).json({error: 'Product not found'});
  }
  // TODO: Perform any necessary validation if necessary

  console.log(`Product has been updated: ${JSON.stringify(productToUpdate)}`)
  res.json({id: productToUpdate.id});
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//--- HTTP PUT: Update existing product by id
//TODO

//--- HTTP Delete: Delete product by id
//TODO

const findObjectById = (array, id) => {
  return array.find(obj => obj.id === id);
};