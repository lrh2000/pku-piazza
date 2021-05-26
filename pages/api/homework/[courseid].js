import {getHomeworkByCID} from "../../../src/db/homework"

export default async (req, res) => {
    const {courseid} = req.query;
    const homeworkByCID = await getHomeworkByCID(parseInt(courseid));
    res.status(200).json(homeworkByCID);
};