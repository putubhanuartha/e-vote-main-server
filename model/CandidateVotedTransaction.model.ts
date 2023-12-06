import { UUID } from "sequelize";
import sequelize from "../config/database";
import WargaModel from "./Warga.model";
import VotingCandidatesModel from "./VotingCandidates.model";

const CandidateVotedTransactionModel = sequelize.define('CandidateVotedTransaction', {

}, { freezeTableName: true })

WargaModel.hasMany(CandidateVotedTransactionModel)
CandidateVotedTransactionModel.belongsTo(WargaModel)

VotingCandidatesModel.hasMany(CandidateVotedTransactionModel)
CandidateVotedTransactionModel.belongsTo(VotingCandidatesModel)

export default CandidateVotedTransactionModel


