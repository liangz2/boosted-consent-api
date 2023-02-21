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

  it('should get all consents by target id', async () => {
    // Create a new consent
    const newConsentResp = await request(app)
      .post(urlUnderTest)
      .send({
        name: 'store.allow_marketing_emails',
        consent_url: 'http://example-store.com',
      })
      .expect(201)

    const targetId = newConsentResp.body.id

    // Update the consent just created
    await request(app)
      .patch(`${urlUnderTest}/${targetId}`)
      .send({
        name: 'store.allow_marketing_emails_updated',
        consent_url: 'http://example-store-updated.com',
      })
      .expect(200)

    // Update again the same consent
    await request(app)
      .patch(`${urlUnderTest}/${targetId}`)
      .send({
        name: 'store.allow_marketing_emails_updated_2',
        consent_url: 'http://example-store-updated-2.com',
      })
      .expect(200)

    const consentsByIdResp = await request(app)
      .get(`${urlUnderTest}/${targetId}`)
      .expect(200)

    expect(consentsByIdResp.body.length).toEqual(3)
    expect(consentsByIdResp.body[0].id).toEqual(targetId)
    expect(consentsByIdResp.body[1].id).toEqual(targetId)
    expect(consentsByIdResp.body[2].id).toEqual(targetId)

    expect(consentsByIdResp.body[0].version).toEqual(0)
    expect(consentsByIdResp.body[1].version).toEqual(1)
    expect(consentsByIdResp.body[2].version).toEqual(2)
  })
})
