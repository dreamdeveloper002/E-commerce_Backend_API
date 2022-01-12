# E-commerce(Backend-API)
- Simple mini E-commerce App APIs(Backend only) with AdonisJS

## FEATURES

- User can sign up (User Type is Admin)
- User can sign in
- User can create Product Categories(CRUD)
- User can create Product Sub Categories(CRUD)
- User can Create Product
- User can Read Product
- User can Update Product
- User can Delete Product

## CHALLENGES
- I need to provide a valid credit card to host relational database instance on Heroku, somehow heroku is having problem verifying my credit card address, due to this reason, i am facing difficulties in hosting the API on heroku.

## Getting Started
### Prerequisites
The tools listed below are needed to run this application:
* Node v14 or above
* Npm v6.0.0 or above

You can check the Node.js and npm versions by running the following commands.

### check node.js version
`node -v`

### check npm version
`npm -v`

## Installation

* Install project dependencies by running `npm install`.

* Run the migrations to create database tables by running `node ace migration:run`

* Access endpoints on `localhost:3333`

## docker-compose for local development

`docker-compose up --build -d`

`docker-compose exec docker-adonis-api sh`

`node ace migration:run`

## Postman documentation

https://documenter.getpostman.com/view/11998048/UUxwBUSq
