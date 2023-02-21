import { Application } from 'express'
import request from 'supertest'
import { createApp, createResources } from '../../app'
import { DomainModel } from '../../resources'

describe('Update consent route', () => {
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

  it('should update a consent', async () => {
    // Create a new consent
    const newConsentResp = await request(app)
      .post(urlUnderTest)
      .send({
        name: 'store.allow_marketing_emails',
        consent_url: 'http://example-store.com',
      })
      .expect(201)

    const targetId = newConsentResp.body.id
    const createdDate = newConsentResp.body.created_at

    // Update the consent just created
    const updateConsentResp = await request(app)
      .patch(`${urlUnderTest}/${targetId}`)
      .send({
        name: 'store.allow_marketing_emails_updated',
        consent_url: 'http://example-store-updated.com',
      })
      .expect(200)

    const updatedDate = updateConsentResp.body.created_at

    // A new entry should be generated
    expect(updateConsentResp.body).toEqual({
      id: targetId,
      name: 'store.allow_marketing_emails_updated',
      consent_url: 'http://example-store-updated.com',
      version: 1,
      created_at: expect.any(String),
    })
    // The creation date should be different
    expect(createdDate).not.toEqual(updatedDate)
  })

  it('should return 400 error when both name and consent_url are missing', async () => {
    await request(app).patch(`${urlUnderTest}/some-id`).send({}).expect(400)
  })
})
