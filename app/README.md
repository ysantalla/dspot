## App sample

### Tecnologies

* Material Desing for ui
* Angular 10.0.0 (with expressjs nodejs v12.0.0 lts to server side rendering)
* Nestjs 7.0.0 (with expressjs nodejs v12.0.0 lts)
* MongoDB (data persistent)

### Clone github repo

$ git clone https://github.com/ysantalla/dspot.git
$ cd dspot/app

### Deploy with Docker-compose

$ docker-compose up

### Server installation

$ npm i -g @nestjs/cli
$ cd server && npm install

### Build docker image for server

$ docker build -t mserver:v1.0.0 .

### Build and running Server production mode

$ npm run build && npm run start:prod

Once the server application is running you can visit [http://localhost:3000/doc](http://localhost:3000/doc) to see the Swagger interface.

### Client installation

$ npm i -g @angular/cli
$ cd client && npm install

### Running Client developer mode

$ cd client
$ npm run ng serve

### Build and running Client production mode

$ npm run build:ssr && npm run serve:ssr

Once the client application is running you can visit [http://localhost:4000](http://localhost:4000)

### Build docker image for client

$ docker build -t mclient:v1.0.0 .

### Server unit tests (incomplete)

$ npm run test

### Server integration tests (incomplete)

$ npm run test:e2e

### Client test (incomplete)
