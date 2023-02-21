import { Sequelize } from 'sequelize'
import { ConsentModel, defineConsentModel } from './db/v1/models/Consent'
import { v4 as uuidv4 } from 'uuid'

const generateConsents = () => {
  const consents: ConsentModel[] = []

  // Generate a list of consent
  for (let i = 0; i < 10; i++) {
    consents.push({
      id: uuidv4(),
      name: `pharmacy.allow_marketing_emails_${i + 1}`,
      consent_url: `http://example.com/marketing_terms_${i + 1}`,
      version: 0,
    })
  }

  return consents
}

export const initResources = async (withMockData = false) => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'src/db/data/consents.sqlite',
    logging: process.env.NODE_ENV === 'test' ? false : console.log,
  })

  // Create consents table
  const consents = await defineConsentModel(sequelize)

  // Create mock consents records
  if (withMockData) {
    await consents.truncate()
    await consents.bulkCreate(generateConsents())
  }

  return { consents }
}

export type DomainModel = Awaited<ReturnType<typeof initResources>>
