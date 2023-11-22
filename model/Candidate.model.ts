import { DataTypes, UUIDV4 } from "sequelize";
import WargaModel from "./Warga.model";
import sequelize from "../config/database";

const CandidateModel = sequelize.define("Candidate", {
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    visi: {
        type: DataTypes.STRING,
        allowNull: false
    },
    misi: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    photoUrl: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, { freezeTableName: true, indexes: [{ unique: true, fields: ["WargaId"] }] })

WargaModel.hasOne(CandidateModel, { onDelete: 'RESTRICT' })
CandidateModel.belongsTo(WargaModel, { onDelete: 'RESTRICT' })

export default CandidateModel