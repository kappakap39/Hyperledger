import {
    handleOpenAIRequest_services

} from '../../../util/other/OpenAI.js';


const handleOpenAIRequest = async (req, res) => {

    const { chat } = req.body;
    const result = await handleOpenAIRequest_services(chat);

    if (result.error) {
        // หากเกิดข้อผิดพลาด ส่ง HTTP status code ที่เหมาะสม
        return res.status(400).json({ error: result.error });
    }
    return res.status(200).json(result);

};

export {
    handleOpenAIRequest
}