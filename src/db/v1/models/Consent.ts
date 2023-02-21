import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize'

class Consent extends Model<
  InferAttributes<Consent>,
  InferCreationAttributes<Consent>
> {
  declare entry_number?: number
  declare id: string
  declare name: string
  declare consent_url: string
  declare version?: number
  declare created_at?: Date
}

export type ConsentModel = InferAttributes<Consent>

export const defineConsentModel = async (db: Sequelize) => {
  await Consent.init(
    {
      id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      consent_url: { type: DataTypes.STRING, allowNull: false },
      version: { type: DataTypes.INTEGER, defaultValue: 0, primaryKey: true },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { modelName: 'Consent', sequelize: db, timestamps: false }
  ).sync()

  return Consent
}
