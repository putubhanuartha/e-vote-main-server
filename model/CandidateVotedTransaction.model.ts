import { UUID } from "sequelize";
import sequelize from "../config/database";
import WargaModel from "./Warga.model";
import VotingCandidatesModel from "./VotingCandidates.model";

const CandidateVotedTransactionModel = sequelize.define('CandidateVotedTransaction', {
    fk_wargaId: {
        type: UUID,
        primaryKey: true
    },
    fk_votingCandidateId: {
        type: UUID,
        primaryKey: true
    }
}, { freezeTableName: true, indexes: [{ unique: true, fields: ["fk_wargaId", "fk_votingCandidateId"] }] })

WargaModel.hasMany(CandidateVotedTransactionModel, { foreignKey: { name: "fk_wargaId" } })
CandidateVotedTransactionModel.belongsTo(WargaModel)

VotingCandidatesModel.hasMany(CandidateVotedTransactionModel, { foreignKey: { name: "fk_votingCandidateId" } })
CandidateVotedTransactionModel.belongsTo(VotingCandidatesModel)

export default CandidateVotedTransactionModel


