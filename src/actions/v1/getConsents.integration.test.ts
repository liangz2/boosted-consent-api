import { Application } from 'express'
import request from 'supertest'
import { createApp, createResources } from '../../app'
import { DomainModel } from '../../resources'

describe('Create consent route', () => {
  const urlUnderTest = '/v1/consent/target'

  let app: Application
  let domainModel: DomainModel

  beforeEach(async () => {
    domainModel = await createResources()
    app = await createApp(domainModel)
  })

  afterEach(async () => {
    await domainModel.consents.truncate()
  })

  it('should get all consents', async () => {
    // Create 10 consents
    const consentCount = 10
    for (let i = 0; i < consentCount; i++) {
      await request(app)
        .post(urlUnderTest)
        .send({
          name: `store.allow_marketing_emails_${i + 1}`,
          consent_url: `http://example-store-${i + 1}.com`,
        })
        .expect(201)
    }
    const allConsentsResp = await request(app).get(urlUnderTest).expect(200)

    expect(allConsentsResp.body.length).toEqual(consentCount)
  })
})
