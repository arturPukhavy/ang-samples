# Express-API 
This is a product API based on Express server
TODO

## Run server
```
node products-api.js
```
## Use cases
#### HTTP GET: Get all products
```
curl http://localhost:3000/api/v1/products
```
#### HTTP POST: Add a new product
```
curl 'http://localhost:3000/api/v1/products' \
--header 'Content-Type: application/json' \
--data '{
"naam": "Notebook",
"merk": "Dell",
"voorraad": 34,
"price": 1200.20
}'
```
#### HTTP PUT: Update a product
```
TODO
```

#### HTTP DELETE: Delete a profuct
```
TODO
```

## Resources
* [Install express](https://expressjs.com/en/starter/installing.html)
