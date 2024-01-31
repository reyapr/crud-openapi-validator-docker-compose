import express, { Express } from 'express'
import { init } from './init'
import { ErrorMiddleware } from './middlewares/error-handler-middleware'
import { ApiKeyValidationMiddleware } from './middlewares/api-key-validation-middleware'
import fs from 'fs'
import * as OpenApiValidator from 'express-openapi-validator'
import yaml from 'yaml'

export const createApp = async (): Promise<express.Application> => {
  const app: Express = express()
  const openApiPath = `${__dirname}/../docs/openapi.yaml`
  const file = fs.readFileSync(openApiPath, 'utf8')
  const swaggerDocument = yaml.parse(file)

  const setupRoutes = async (app: Express): Promise<void> => {
    const { userController } = await init()

    app.get('/', (req, res) => {
      res.send('Hello World')
    })

    app.use(
      '/users/v1',
      ApiKeyValidationMiddleware.handle,
      userController.getRouter()
    )
  }

  app.use(express.json())
  app.use(
    OpenApiValidator.middleware({
      apiSpec: swaggerDocument,
      validateRequests: true,
      validateResponses: true
    })
  )
  await setupRoutes(app)

  // error handler
  app.use(ErrorMiddleware.handle)

  return app
}
;(async () => {
  const PORT = process.env.PORT || 3000
  const app = await createApp()

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})()
