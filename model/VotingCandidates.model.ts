import { DataTypes, UUID, UUIDV4 } from "sequelize";
import sequelize from "../config/database";
import VotingModel from "./Voting.model";
import CandidateModel from "./Candidate.model";

const VotingCandidatesModel = sequelize.define('VotingCandidate', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4
    },
    fk_votingId: {
        type: UUID,
        allowNull: false,
    },
    fk_candidateId: {
        type: UUID,
        allowNull: false,
    }
}, { freezeTableName: true, indexes: [{ unique: true, fields: ["fk_votingId", "fk_candidateId"] }] })

VotingModel.hasMany(VotingCandidatesModel, {
    foreignKey: {
        name: "fk_votingId"
    },
    onDelete: 'RESTRICT'
})
VotingCandidatesModel.belongsTo(VotingModel, { foreignKey: { name: "fk_votingId" }, onDelete: 'RESTRICT' })

CandidateModel.hasOne(VotingCandidatesModel, { foreignKey: { name: "fk_candidateId" }, onDelete: 'CASCADE' })
VotingCandidatesModel.belongsTo(CandidateModel, { foreignKey: { name: "fk_candidateId" }, onDelete: 'CASCADE' })

export default VotingCandidatesModel