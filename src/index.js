import redis from 'redis'
import bluebird from 'bluebird'
import invariant from 'invariant'

class RedisClient {
  namespace = undefined
  client = undefined

  initialize = ({
    namespace,
    port,
    host,
  }) => {
    invariant(port && host && namespace, `'port', 'host', 'namespace' must be provided`)

    if (this.client) return
    this.namespace = namespace
    // wrap all redis functions with promises
    // it'll append the word Async behind every function name
    // ex:
    //  client.get
    //  client.getAsync
    bluebird.promisifyAll(redis.RedisClient.prototype)
    bluebird.promisifyAll(redis.Multi.prototype)

    this.client = redis.createClient(port, host)
  }

  getClient = () => {
    invariant(this.client, `call initialize() first.`)
    return this.client
  }

  get = async (key) => {
    const res = await this.getClient().getAsync(`${this.namespace}/${key}`)
    return JSON.parse(res)
  }

  set = async (key, value) => {
    const reply = await this.getClient().setAsync(`${this.namespace}/${key}`, JSON.stringify(value))
    if (!reply) throw new Error(`Unable to set in redis`)
    return reply
  }

  del = async (key) => {
    return this.getClient().delAsync(`${this.namespace}/${key}`)
  }

  expire = async (key, expireSec) => {
    const reply = await this.getClient().expireAsync(`${this.namespace}/${key}`, expireSec)
    if (!reply) throw new Error(`Unable to set expiration`)
    return reply
  }

  flushDb = async (key = '*') => {
    const keysToDelete = await this.keys(key)
    for (let i = 0; i < keysToDelete.length; i++) {
      await this.getClient().delAsync(keysToDelete[i])
    }
  }

  keys = async (key = '*') => {
    return await this.getClient().keysAsync(`${this.namespace}/${key}`)
  }
}

export default new RedisClient()
