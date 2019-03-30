# BSV_Full

## Local deployment

1. `package.json`:

```
    "scripts": {
    "server": "node index.js",
    "client": "cd client && npm run build",
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "concurrently \"node index.js\" \"cd client && npm run build\""
  },
```

2. `index.js` - will serve the index.html in the build folder to your routes

```
app.use(express.static(path.join(__dirname, "client/build")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
```

3. Setup the Database and put the credentials in `.env` file

4. update `.env.production` in `client` folder with the correct URL endpoint of the Express server (for local deployment, it is the IP of the Server machine)

5. `export` the environment variables

6. `npm start` - this will run the `start` script in `package.json` to start the node server and build the React frontend

7. Go to the IP address and port of the server computer within local intranet to access the site

# GCP Deployment

## Dev version deployed to https://bsv-dot-s4-phoenix-dev.appspot.com

## Google Cloud

1. Create a bucket for the csv file drop, put bucket name in `app.yaml` file, field: `GCLOUD_STORAGE_BUCKET`
2. Create a SQL database using Google Cloud SQL, credentials store in `app.yaml` file, fields: `MYSQL_USER`, `MYSQL_KEY`, `MYSQL_DBNAME`, `INSTANCE_CONNECTION_NAME: {project}:{location}:{sql_instance}`
3. Under `app.yaml`, put:

```javascript
beta_settings:
  cloud_sql_instances: {project}:{location}:{sql_instance}
```

(Same as `INSTANCE_CONNECTION_NAME` above)

4. Create a `App Engine` instance and make sure it has `SQL Admin` role enabled (https://cloud.google.com/appengine/docs/standard/nodejs/using-cloud-sql)

## Server

1. On the very top of `app.yaml` file, put:

   ```javascript
   runtime: nodejs10;
   service: bsv;
   ```

   also add on the bottom, below the `beta_settings`:

   ```javascript
    handlers:
    - url: /.*
      secure: always
      redirect_http_response_code: 301
      script: auto
   ```

   (The `service` parameter indicates to run the server as a service under `Google App Engine`)

2. Using Sequelize, make sure the `config.js` file is configured:

```javascript
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_KEY,
    database: process.env.MYSQL_DBNAME,
    dialect: "mysql",
    dialectOptions: {
      socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`
    },
    timezone: "America/New_York"
  }
```

3. Also see `Local Deployment - Step 2 above`

4. Get the app engine URL, usually `{service}-dot-{project}.appspot.com`, need it for the client part below

## Client

1. Change `.env.production` to the app engine URL
2. Run `npm run build` to create a `build` folder (OPTIONAL: Modify the `build` script in `package.json` to remove the map files after build: `"build": "react-scripts build && rm build/static/js/*.map",`)
3. The node routes will serve the html in `build/index.html` for all the routes
4. Deploy the code to GCP using Cloud SDK command `gcloud app deploy`
