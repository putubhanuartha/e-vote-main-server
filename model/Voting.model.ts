import { DataTypes, UUIDV4 } from "sequelize";
import sequelize from "../config/database";
import { JenisPilihan, StatusVoting } from '../enums';
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
    status: {
        type: DataTypes.ENUM(...(Object.values(StatusVoting).map((el) => el))),
        allowNull: false,
        defaultValue: StatusVoting.not_ready
    }
}, { freezeTableName: true })

export default VotingModel