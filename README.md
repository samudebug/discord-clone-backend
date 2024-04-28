# Chat APP (Discord Clone)

This is the backend for a chat app with features similar to Discord. You can check the repository for the mobile app [here](https://github.com/samudebug/discord-clone-app)

### Structure
The app is built using:
- [Nest](https://github.com/nestjs/nest)
- [Mongo.DB](https://www.mongodb.com/)
- [Prisma](https://github.com/prisma/prisma)
- [Socket.io](https://github.com/socketio/socket.io)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

### Features
- [x] Chats
- [x] Profiles
- [x] Messages
- [x] Attachments
- [x] Real Time Chat
- [ ] Servers
- [ ] Channels
- [ ] Roles

### Running the App

Install the dependencies using:

```sh
npm install
```

Setup the .env file using [.env.example](./.env.example) as a base

- DATABASE_URL: A MongoDB database URL
- FIREBASE_SERVICE_ACCOUNT: The JSON of a Firebase/GCP service acccount encoded as Base64
- GOOGLE_CLOUD_PROJECT: The ID of the Firebase/GCP project

To run the app locally, run:
```sh
npm run start:dev
```

##### About DB
Prisma is very picky about how your MongoDB is set up. Using [MongoDB Atlas](https://www.mongodb.com/atlas) is fine, but if you want to use your own deployment, you have to setup Replica Sets on your MongoDB.

Thankfully, this project also includes a prepared `docker-compose.yml` file that runs a container with a MongoDB completely set up.