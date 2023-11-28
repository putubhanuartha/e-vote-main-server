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

FormContentModel.belongsToMany(WargaModel, { through: FormFilledTransactionModel })
WargaModel.belongsToMany(FormContentModel, { through: FormFilledTransactionModel })

export default FormFilledTransactionModel

