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
    // Clear all records from the DB
    await domainModel.consents.truncate()
  })

  it('should create a new consent', async () => {
    const newConsentResp = await request(app)
      .post(urlUnderTest)
      .send({
        name: 'store.allow_marketing_emails',
        consent_url: 'http://example-store.com',
      })
      .expect(201)

    expect(newConsentResp.body).toEqual({
      id: expect.any(String),
      name: 'store.allow_marketing_emails',
      consent_url: 'http://example-store.com',
      version: 0,
      created_at: expect.any(String),
    })
  })

  it('should return 400 error when name or consent_url is missing', async () => {
    await request(app)
      .post(urlUnderTest)
      .send({
        name: 'store.allow_marketing_emails',
      })
      .expect(400)
  })
})
