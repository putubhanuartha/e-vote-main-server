import { DataTypes, UUID, UUIDV4 } from "sequelize";
import sequelize from "../config/database";
import { StatusFormFilling } from "../enums";

const FormContentModel = sequelize.define("FormContent", {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    titleForm: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contentForm: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: StatusFormFilling.ready,
        allowNull: false
    },

}, { freezeTableName: true })

export default FormContentModel