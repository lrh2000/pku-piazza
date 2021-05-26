import {getHomeworkList} from "../../src/db/homework";

export default async (req, res) =>{
    const homework = await getHomeworkList();
    res.status(200).json(homework);
};