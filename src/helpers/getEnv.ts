import dtnv from 'dotenv'
dtnv.config()

const { NODE_ENV, BASE_URL_PROD, BASE_URL_FRONTEND_PROD, BASE_URL_DEV, BASE_URL_FRONTEND_DEV } = process.env

export const getEnv = () => {
  let BASE_URL
  let BASE_URL_FRONTEND
  switch (NODE_ENV) {
    case 'production':
      return {
        BASE_URL: BASE_URL_PROD,
        BASE_URL_FRONTEND: BASE_URL_FRONTEND_PROD,
      }
    case 'development':
      return {
        BASE_URL: BASE_URL_DEV,
        BASE_URL_FRONTEND: BASE_URL_FRONTEND_DEV,
      }
    default:
      return {
        BASE_URL: null,
        BASE_URL_FRONTEND: null,
      }
  }
}
