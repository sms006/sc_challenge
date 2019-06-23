# Waitinglist

This service allows to manage a waiting list based on one-time-tokens. It allows to generate tokens that can be handed out to users. If a token is used, the service verifies that it is still valid and marks the token as invalid.

# Preparation

## Postgres
* Install and run a postgres DB and configure values in `config.json`
* Prepare DB by running `init-sql.db` against database (e.g. `psql -h localhost -U postgres postgres -f init-db.sql`)

## Development
* Run `npm install` to install dependencies
* Run `npm run dev` to run your files with ts-node

## Production
* Run `npm run build` to transpile ts code to javascript (`dist` folder)
* Run `npm start` to transpile and run the javascript code

# Routes

## `POST /genearteTokens`

This route allows to retrieve tokens from the service.

Body:
```
{
  "number_of_requested_tokens": 12
}
```

Response:
* `HTTP 200` with body
```
{
  "tokens":[
    "token1",
    "token2",
    // ...
  ]
}
```

`curl -XPOST -H'Content-type: application/json' -d '{"number_of_requested_tokens":12}' localhost:10000/generateTokens`

## `POST /useToken`

This route is used to check the validity of a token and mark it as used.

Body:
```
{
  "token": "token1"
}
```

Reponse:
* `HTTP 204`: token is valid
* `HTTP 404`: token is is unknown
* `HTTP 401`: token was already used

`curl -XPOST -H'Content-type: application/json' -d '{"token":"0834ba88-30b8-4a62-9879-470f2418275b"}' localhost:10000/useToken -v`

# Tests
* Run the service: `npm start`
* Run the tests once the server is up: `npm test`
