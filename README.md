# Northcoders Portfolio: Back-end ๐๏ธ 

## ๐ญ Description

This API is used by our front-end app: ![Northcoders Portfolio](https://github.com/davidptclark/nc-portfolio-fe)

---
## ๐  Hosted version

https://nc-portfolio-app.herokuapp.com/api

Following this URL will produce a JSON file that will list all available endpoints: with available queries, example request bodies, and example responses.

For example ๐:

![Imgur](https://0x0.st/obtU.png)

---
## ๐ฅ๏ธ Running the API Locally

๐ง Before beginning setup, please check you have _at least_ these versions of the following:

- `Node.js` - v16.13.1
- `Postgres` - v. 12.0.5

After doing so, perform each step, in order:

### ๐ป โก๏ธ ๐ป Cloning the repository:

```
git clone https://github.com/davidptclark/nc-portfolio-be.git
```

### ๐๏ธ Install required packages:

Simply run `npm install` to install the necessary dependencies required.

### ๐ Environment setup:

This repository does not contain the necessary .env files that set the value of PGDATABASE to a specific database, as they are part of the gitignore and will only be stored locally. After cloning, you will need to create two .env files in the root directory:

`.env.development`

```
PGDATABASE=nc_be
```

`.env.test`

```
PGDATABASE=nc_be_test
```

### ๐ฑ Seeding local databases:

To start the API, run the command `npm start`. This will instruct the API to listen on the default port: 9090.

If you would like to reinitialise the database, use the command `npm run setup-dbs` followed by `npm run seed` to re-seed the database.

### ๐งช Running tests:

The available endpoint have been created using Jest and pre-written tests are found in `./__tests__/`. The test files are configured to re-seed the database after each test is complete; to run these tests, as well as any you have written, use the command `npm test FILENAME`.
