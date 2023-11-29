import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import FormContentModel from "./FormContentModel";
import WargaModel from "./Warga.model";

const FormFilledTransactionModel = sequelize.define("FormFilledTransaction", {
    filledContent: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, { freezeTableName: true })

WargaModel.hasMany(FormFilledTransactionModel)
FormFilledTransactionModel.belongsTo(WargaModel)

FormContentModel.hasMany(FormFilledTransactionModel)
FormFilledTransactionModel.belongsTo(FormContentModel)


export default FormFilledTransactionModel

