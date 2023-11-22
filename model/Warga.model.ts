import { DataTypes, UUIDV4 } from "sequelize";
import sequelize from "../config/database";

const WargaModel = sequelize.define("Warga", {
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    nama: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(800),
        allowNull: true
    },
    nik: {
        type: DataTypes.STRING(16),
        allowNull: false,
        unique: true
    },
    registered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    token: {
        type: DataTypes.STRING(5),
        unique: true,
        allowNull: true
    }
}, { freezeTableName: true })

export default WargaModel