import 'mocha'

import * as chai from 'chai'
import axios from 'axios'
import { fail } from 'assert';


const serviceUrl = 'http://localhost:10000'


describe('Waitinglist service', () => {
  describe('/generateTokens', () => {
    it('should return tokens for happy path', async () => {
      const response = await axios({
        url: serviceUrl + '/generateTokens',
        method: 'POST',
        data: {
          'number_of_requested_tokens': 12
        }
      })
      chai.expect(response.data.tokens).to.not.be.undefined
      chai.expect(response.data.tokens.length).to.eql(12)
    })
    it('should return 400 for number input as string', async () => {
      try {
        const response = await axios({
          url: serviceUrl + '/generateTokens',
          method: 'POST',
          data: {
            'number_of_requested_tokens': '12'
          }
        })
      } catch (e) {
        chai.expect(e.response.status).to.equal(400)
        return
      }
      fail()
    })
    it('should return 400 for bad body', async () => {
      try {
        const response = await axios({
          url: serviceUrl + '/generateTokens',
          method: 'POST',
          data: {
            'count': 12
          }
        })
      } catch (e) {
        chai.expect(e.response.status).to.equal(400)
        return
      }
      fail()
    })

  })
  describe('/useTokens', () => {
    it('should verify a legit token', async () => {
      const setupResponse = await axios({
        url: serviceUrl + '/generateTokens',
        method: 'POST',
        data: {
          'number_of_requested_tokens': 1
        }
      })

      const response = await axios({
        url: serviceUrl + '/useToken',
        method: 'POST',
        data: {
          'token': setupResponse.data.tokens[0]
        }
      })
      chai.expect(response.status).to.equal(204)
    })
    it('should return 404 for unknoen token', async () => {
      try {
        const response = await axios({
          url: serviceUrl + '/useToken',
          method: 'POST',
          data: {
            'token': 'does not exist'
          }
        })
      } catch (e) {
        chai.expect(e.response.status).to.equal(404)
        return
      }
      fail()
    })
    it('should return 401 already used token', async () => {
      const setupResponse = await axios({
        url: serviceUrl + '/generateTokens',
        method: 'POST',
        data: {
          'number_of_requested_tokens': 1
        }
      })

      const response = await axios({
        url: serviceUrl + '/useToken',
        method: 'POST',
        data: {
          'token': setupResponse.data.tokens[0]
        }
      })
      chai.expect(response.status).to.equal(204)
      try {
        const response = await axios({
          url: serviceUrl + '/useToken',
          method: 'POST',
          data: {
            'token': setupResponse.data.tokens[0]
          }
        })
      } catch (e) {
        chai.expect(e.response.status).to.equal(401)
        return
      }
      fail()
    })

  })
})
