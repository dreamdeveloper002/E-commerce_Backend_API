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

## Endpoints

| Method      | Description    | Endpoints    | Role   | 
| :------------- | :----------: | -----------: | -----------: |
|  POST | Create user   | /api/v1/auth/signup    | *   |
| POST   | signin user | /api/v1/auth/login | * |
| POST   | logout user | /api/v1/auth/logout | * |
| POST   | forgot password | /api/v1/auth/forgotpassword | * |
| PUT   | reset password | /api/v1/auth/resetpassword/:token | * |
| PUT   | update password | /api/v1/auth/updatepassword/:id | * |
| GET   | verify email | /api/v1/auth/verify/email | * |
| POST   | create category | /api/v1/category/create | admin |
| GET   | get category | /api/v1/category/:id | * |
| PUT  | update category | /api/v1/category/update/:id | admin |
| DELETE | delete category | /api/v1/category/delete/:id | admin |
| POST | create sub category | /api/v1/sub_category/create/:categoryId | admin |
| PUT | update sub category | /api/v1/sub_category/update/:id | admin |
| GET   | get sub category | /api/v1/sub_category/:id | * |
| DELETE | delete sub category | /api/v1/sub_category/delete/:id | admin |
| POST   | create product | /api/v1/product/create/:categoryId/:subCategoryId | admin |
| GET   | get product | /api/v1/product/:id | * |
| PUT  | update category | /api/v1/product/update/:id | admin |
| DELETE | delete product | /api/v1/product/delete/:id | admin |

## Postman documentation

https://documenter.getpostman.com/view/11998048/UVXhpbdp
