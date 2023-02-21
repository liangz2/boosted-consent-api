import { createApp, createResources } from './app'

const run = async () => {
  const resources = await createResources(
    process?.env?.WITH_MOCK_DATA === 'true'
  )

  const app = await createApp(resources)

  app.listen(3000, () => {
    console.log('Consent API listening on port 3000')
  })
}

run().catch(console.error)
