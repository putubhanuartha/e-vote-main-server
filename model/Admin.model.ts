import { DataTypes, UUIDV4 } from 'sequelize';
import sequelize from "../config/database";

const AdminModel = sequelize.define('Admin', {
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(600),
        allowNull: false
    }
}, { freezeTableName: true })

export default AdminModel