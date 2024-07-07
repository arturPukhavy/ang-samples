# HTTP Example

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.5.

### Install modules
```
npm install
```
### Run Angular server
```
ng serve
```
### Use Angular dev-proxy
Angular allows to set up a dev-server proxy to a backend server. This configuration is only for dev setup and should not be used in production.
```
ng serve --proxy-config proxy.conf.json
```
`proxy.conf.json` is a proxy configuration file. 
This is an example:
```
{
   "/api/v1/products": {
      "target": "http://localhost:3000",
      "secure": false
   }
}
```
In this example Angular will proxy all "/v1/products" request to "http://localhost:3000"
