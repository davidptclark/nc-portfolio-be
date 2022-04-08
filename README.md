# nc-portfolio-be

Our backend api is hosted on heroku at:

https://nc-portfolio-app.herokuapp.com/api

# Setup

Add the files .env.test and .env.development containing:

```
PGDATABASE=nc_be_test
```

and

```
PGDATABASE=nc_be
```

respectively.

Mininum versions of :

Node.js : v16.13.1
PSQL : 12.0.5

are required to run locally.

# Summary

Nc-portfolios is a tool for app-creators and employers to share and view video demos of apps they've made.

The live messaging feed allows creators to connect with employers easily and they can share information about themselves such as a github link.

The app has in built user authentication.

# Technology

The front end of the app is built in react native. We used expo-av video player to render the videos and cloudinary to store our video files on. The user authentication is achieved using hashed passwords on our backend data base and becrypt to compare the hashed passwords.

The back end server is created using express and hosted on heroku. Our database is built using psql.
