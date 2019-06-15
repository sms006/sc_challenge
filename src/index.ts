import * as Restify from 'restify'
import { TokenStorage } from './TokenStorage'
import { PostgresTokenStorage } from './PostgressTokenStorage'
import Knex = require('knex')
import { BadRequestError } from 'restify-errors'
import _ from 'lodash';
import { InvalidTokenError } from './InvalidTokenError';
import { TokenNotFoundError } from './TokenNotFoundError';

type Config = {
  postgres: {
    host: string,
    port: number,
    username: string,
    password: string,
    database: string
  },
  http: {
    port: number
  }
}

function getServer() {
  const server = Restify.createServer()
  server.use(Restify.plugins.bodyParser())
  return server
}

function getKnex(config: Config) {
  const knex: Knex = Knex({
    client: 'pg',
    connection: `pgsql://${config.postgres.username}:${config.postgres.password}@${config.postgres.host}:${config.postgres.port}/${config.postgres.database}`
  } as Knex.Config)
  return knex
}

function getTokenStorage(config: Config) {
  const knex = getKnex(config)
  return new PostgresTokenStorage(knex)
}


async function run() {
  const config: Config = require('../config')

  const tokenStorage = getTokenStorage(config)


  const server = getServer()
  server.post(
    '/generateTokens',
    async (req: Restify.Request, res: Restify.Response, next: Restify.Next) => {

      const body = req.body
      if (
        !body
        || !body.number_of_requested_tokens
        || !_.isNumber(body.number_of_requested_tokens)
      ) return next(new BadRequestError())
      const numberOfTokens = body.number_of_requested_tokens

      const tokenTasks = []
      for (let idx = 0; idx < numberOfTokens; idx++) {
        tokenTasks.push(tokenStorage.generateToken())
      }
      const tokens = await Promise.all(tokenTasks)

      res.send(200, { tokens })
      return next()
    }
  )

  server.post(
    '/useToken',
    async (req: Restify.Request, res: Restify.Response, next: Restify.Next) => {
      const body = req.body
      if (
        !body
        || !body.token
        || !_.isString(body.token)
      ) return next(new BadRequestError())

      const token = body.token

      try {
        await tokenStorage.verifyToken(token)
        await tokenStorage.markTokenUsed(token)
      } catch (error) {
        if (error instanceof InvalidTokenError) {
          res.send(401)
          return next()
        } else if (error instanceof TokenNotFoundError) {
          res.send(404)
          return next()
        } else {
          console.log(error)
          res.send(500)
          return next()
        }
      }

      res.send(204)
      return next()
    }
  )

  server.listen(config.http.port)
}



run()
