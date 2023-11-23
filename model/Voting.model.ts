import { DataTypes, UUIDV4 } from "sequelize";
import sequelize from "../config/database";
import { StatusVoting } from '../enums';
import AdministrativeModel from "./Administrative.model";
const VotingModel = sequelize.define('Voting', {
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    epochtimeStart: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    epochtimeEnd: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(...(Object.values(StatusVoting).map((el) => el))),
        allowNull: false,
        defaultValue: StatusVoting.not_ready
    }
}, { freezeTableName: true })

AdministrativeModel.hasMany(VotingModel, { onDelete: 'RESTRICT', foreignKey: { allowNull: false } })
VotingModel.belongsTo(AdministrativeModel, { onDelete: 'RESTRICT', foreignKey: { allowNull: false } })

export default VotingModel