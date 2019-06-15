import { TokenStorage } from './TokenStorage'
import { InvalidTokenError } from './InvalidTokenError'
import * as Knex from 'knex'
import * as uuid from 'uuid'
import * as _ from 'lodash'
import { TokenNotFoundError } from './TokenNotFoundError'

class PostgresTokenStorage extends TokenStorage {

  constructor(
    private knex: Knex
  ) {
    super()
  }

  public async  generateToken(): Promise<string> {
    const token = uuid.v4()
    await this.knex
      .table('tokens')
      .insert({
        id: token
      })
    return token
  }

  public async verifyToken(id: string): Promise<void> {
    const tokens = await this.knex
      .table('tokens')
      .where({ id })

    if (tokens.length === 0) throw new TokenNotFoundError(`token with id ${id} not found`)

    const token = tokens[0]

    if (!_.isEmpty(token.usage_date)) throw new InvalidTokenError(`token with id ${id} already used`)
  }

  public async markTokenUsed(id: string): Promise<void> {
    await this.knex
      .table('tokens')
      .where({ id })
      .update({ usage_date: new Date().toISOString() })
  }
}

export {
  PostgresTokenStorage
}
