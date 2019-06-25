# Eclectic-List Server

## Deployed Links
Client app: https://eclectic-list.herokuapp.com/

Server API: https://eclectic-list-server.herokuapp.com/api/posts

Client code: https://github.com/EndreoT/Eclectic-List-Client

### Description
Node.js server for eclectic-list full stack application. Eclectic List is a concept full stack web application for creating posts for selling items that can include images, comment on user posts, and choose profile avatar images. This website draws inspiration from sites as Craigslist and Reddit. 

### Motivation
The intent of this app is to showcase a full stack web application built by Tristan Endreo, specifically the Node.js backend. Currenly, the intent is not for users to actually post real items for sale on this site. Instead, please feel free to register a 'mock' profile, create, edit, and delete posts, and comment on any post to better view Tristan's skills as a full stack and backend web developer. 

### App deployed links
```
Client: https://eclectic-list.herokuapp.com/
Server: https://eclectic-list-server.herokuapp.com/<endpoint>
Server example: https://eclectic-list-server.herokuapp.com/api/posts
```

### Results 
This app uses the MEVN stack, which stands for MongoDB for the database, Express.js for the web server framework, Vue.js for the frontend framework, and Node.js for the run-time environment. Securely access protected routes using a JSON Web Token (JWT), and backend authentication is routed through the Passport.js middleware. The Vuex library for Vue allows for persistent user login. Lastly, images are stored using Cloudinary hosting. Also, the server was recently rewritten in Typescript!

This app is hosted on two Heroku apps: First, the server side creates a RESTful API. An example of the the '/api/posts' endpoint can be found here. Second, the Vue.js app is also served by an Express.js server on Heroku. 


### Installation
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

