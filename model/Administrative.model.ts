import { DataTypes, UUIDV4 } from "sequelize";
import sequelize from "../config/database";
import { JenisPilihan } from "../enums";

const AdministrativeModel = sequelize.define("Administrative", {
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    kecamatan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    kelurahan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rw: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rt: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    jenisPilihan: {
        type: DataTypes.ENUM(...(Object.values(JenisPilihan).map((el) => el))),
        allowNull: false,
        defaultValue: JenisPilihan.rt
    },
}, { freezeTableName: true })


export default AdministrativeModel