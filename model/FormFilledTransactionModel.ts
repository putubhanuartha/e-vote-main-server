import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import FormContentModel from "./FormContentModel";
import WargaModel from "./Warga.model";

const FormFilledTransactionModel = sequelize.define("FormFilledTransaction", {
    userId: {
        type: DataTypes.UUID,
        references: {
            model: WargaModel,
            key: 'id'
        }
    },
    formContentId: {
        type: DataTypes.UUID,
        references: {
            model: FormContentModel,
            key: 'id'
        }
    }
}, { freezeTableName: true, indexes: [{ unique: true, fields: ["userId", "formContentId"] }] })

FormContentModel.belongsToMany(WargaModel, { through: FormFilledTransactionModel })
WargaModel.belongsToMany(FormContentModel, { through: FormFilledTransactionModel })

