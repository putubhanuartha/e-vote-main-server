import cron from 'node-cron';
import CandidateVotedTransactionModel from './model/CandidateVotedTransaction.model';
import VotingModel from './model/Voting.model';
import { StatusVoting } from './enums';
import { Op } from 'sequelize';
const checkVotingStatusActive = async (milis: number) => {
    const [rows] = await VotingModel.update({ status: StatusVoting.active }, { where: { [Op.and]: [{ epochtimeStart: { [Op.lte]: milis } }, { epochtimeEnd: { [Op.gt]: milis } }] } })
    console.log(rows + " rows voting is updated to 'ACTIVE'")
}

const checkVotingStatusDone = async (milis: number) => {
    const [rows] = await VotingModel.update({ status: StatusVoting.done }, { where: { [Op.and]: [{ epochtimeStart: { [Op.lte]: milis } }, { epochtimeEnd: { [Op.lte]: milis } }] } })
    console.log(rows + " rows voting is updated to 'DONE'")
}
const runCronJobs = () => {
    cron.schedule("* * * * *", () => {
        const milis = Math.floor(new Date().getTime() / 1000)
        checkVotingStatusActive(milis)
        checkVotingStatusDone(milis)
    })
}

export default runCronJobs

