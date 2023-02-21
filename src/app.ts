import express from 'express'
import bodyParser from 'body-parser'
import { DomainModel, initResources } from './resources'
import { setupRoutes } from './actions'

export const createResources = async (withMockData = false) =>
  await initResources(withMockData)

export const createApp = async (domainModel: DomainModel) => {
  const app = express()

  app.use(bodyParser.json())

  app.use(setupRoutes(domainModel))

  return app
}
