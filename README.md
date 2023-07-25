# REST API with Node.js

This is a RESTful API built with Node.js that provides CRUD functionality for users, products, and orders. It includes an authentication middleware using JSON Web Tokens (JWT) and utilizes MongoDB and Mongoose as the persistence layer with MongoDB Atlas. The API also employs Mongoose validation and enables users to upload images using the Multer package. Additionally, the API supports user login and signup.

created by Sapir Ohava.  
Last Updated - july 2023

## Installation

Clone the repository to your local machine using Git:

```bash
git clone <repository_url>
```

Navigate to the project's directory:

```bash
cd rest-api-node
```

Install the required dependencies using npm:

```bash
npm install
```

Run the development server using nodemon:

```bash
npm start
```

Make sure you have Node.js and npm (Node Package Manager) installed on your system before running the installation commands. If you don't have nodemon installed globally, you can install it using:

```bash
npm install -g nodemon
```

## Usage

get - http://localhost:3000/user - get all users
get - http://localhost:3000/user/:userId - get a user
post - http://localhost:3000/user/signup - user signup (create a user)
delete - http://localhost:3000/user/:userId - delete a user
post - http://localhost:3000/user/login - user login

get - http://localhost:3000/product - get all products
post - http://localhost:3000/product - create a product
get - http://localhost:3000/product/:productId - get a product
delete http://localhost:3000/product/:productId - delete a product
patch http://localhost:3000/product/:productId - update a product

get http://localhost:3000/order - get all orders
post http://localhost:3000/order - create an order
get http://localhost:3000/order/:orderId - get an order
delete http://localhost:3000/order/:orderId - delete an order

## License

[MIT](https://choosealicense.com/licenses/mit/)
