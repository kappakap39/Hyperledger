import express from 'express';
import { 
    handleOpenAIRequest,
} from '../../controller/service/other/OpenAI.js';

const routerGenerate = express.Router();

routerGenerate.post('/OpenAIchat', handleOpenAIRequest);

export default routerGenerate;
