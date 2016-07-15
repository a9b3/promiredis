const env = process.env.NODE_ENV || 'dev'

const config = {}

// env overrides
const redisHost = process.env.REDIS_HOST
const redisPort = process.env.REDIS_PORT

config.dev = {
  redis: {
    port: redisPort || 6379,
    host: redisHost || `docker.me`,
    namespace: `PROMIREDIS_DEV`,
  },
}

config.test = {
  redis: {
    port: redisPort || 6379,
    host: redisHost || `docker.me`,
    namespace: `PROMIREDIS_TEST`,
  },
}

// require env vars set
config.travis = {
  redis: {
    port: redisPort,
    host: redisHost,
    namespace: `PROMIREDIS_TEST`,
  },
}

// require env vars set
config.prod = {
  redis: {
    port: process.env.REDIS_SERVICE_PORT,
    host: process.env.REDIS_SERVICE_HOST,
    namespace: `PROMIREDIS_PROD`,
  },
}

export default config[env]
