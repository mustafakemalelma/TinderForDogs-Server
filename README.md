# Tinder For Dogs

This is the server of the web application.**Express.js** library is used
in this project which bunch of other projects.Some of them are _apollo_, _mongoose_ etc.

### Dependicies

If you want to run it, you must have the following **dependicies** first.

- Node
- npm

### Installation

Before trying to start the api, you must have **.env** file.This files contains the sensitive data for
application to work properly.Thus you need to **create** one before trying to start.It should look like this:

```javascript
DB_CONNECT = <your mongo db conenction url>
BCRYPT_SALT_ROUND = <salt round number to hash the password>
ACCESS_TOKEN_PRIVATE = <some text for access token hashing>
REFRESH_TOKEN_PRIVATE = <some text for refresh token hashing>
```

After the .env file creation, you can follow the commands below to run the **API**

1. npm install
2. npm start
