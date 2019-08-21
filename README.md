# Eclectic-List Server

## Deployed Links
Client app: https://eclectic-list.herokuapp.com/

Server API: https://eclectic-list-server.herokuapp.com

Server example endpoint: https://eclectic-list-server.herokuapp.com/api/posts

Client code: https://github.com/EndreoT/Eclectic-List-Client

## Description
The Node and Express.js server for Eclectic List. Eclectic List is a classified advertisements full stack web application allowing users to create posts about items for sale. Posts can contain text, images, and a category, users can comment on the posts, and users can select an avatar image. This website draws inspiration from sites as Craigslist and Reddit. 

## Motivation
The intent of this app is to give users a platform for easily selling items for free and discussing those items, compared with other sites which monitize the posting of items.

## Results 
This app uses the MEVN stack, which stands for MongoDB for the database, Express.js for the web server, Vue.js for the frontend framework, and Node.js for the run-time environment. Securely access protected routes using a JSON Web Token (JWT), and backend authentication is routed through the Passport.js middleware. Mocha and Chai unit tests are included. The server is now written in Typescript!

The Vuex library for Vue allows for persistent user login. Lastly, images are stored using Cloudinary hosting. 

This app is hosted on two Heroku apps: First, the server side exposes a RESTful API design pattern. Second, the Vue.js app is also served by an Express.js server on Heroku. This separation of client and server, as well as the REST API, paves the road for the possibile development of a native mobile client in the future.

## Installation
```
cd path/to/eclectic-list-server
npm install
touch .env
```
You will need a Cloudinary (https://cloudinary.com/) account for image parsing and storage.
Arrange the .env file like so:
```
#Cloudinary information
CLOUD_NAME = <Cloudinary cloud name>
API_KEY = <API key>
API_SECRET =<API secret>

#DB information
mLabDB=<mongoDB url>

#secret
secret = <private secret>
```

## Future improvements
- [ ] Allow users to edit and delete comments
- [ ] Add locations to posts
- [ ] Allow for direct messages between users in real time
