import express from 'express';
import { 
    GenerateHandler,
    DecryptHashHandler,
    getdata_genHandler,
    getByHashHandler,
    generateSHAHandler,
    DeleteHashHandler,
    UPDateHashHandler,
} from '../controller/generate.js';

const routerGenerate = express.Router();

routerGenerate.post('/hash', GenerateHandler);
routerGenerate.post('/hashSHA', generateSHAHandler);
routerGenerate.post('/decrypthash', DecryptHashHandler);
routerGenerate.get('/getdata', getdata_genHandler);
routerGenerate.get('/ByHash', getByHashHandler);
routerGenerate.patch('/updatehash', UPDateHashHandler);
routerGenerate.delete('/DeleteHash', DeleteHashHandler);

export default routerGenerate;
