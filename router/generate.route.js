import express from 'express';
import { 
    GenerateHandler,
    DecryptHashHandler,
    getData_genHandler,
    getByHashHandler,
    generateSHAHandler,
    DeleteHashHandler,
    UPDateHashHandler,
} from '../controller/service/generate.js';

const routerGenerate = express.Router();

routerGenerate.post('/hash', GenerateHandler);
routerGenerate.post('/hashSHA', generateSHAHandler);
routerGenerate.post('/decryptHash', DecryptHashHandler);
routerGenerate.get('/getData', getData_genHandler);
routerGenerate.get('/ByHash', getByHashHandler);
routerGenerate.patch('/updateHash', UPDateHashHandler);
routerGenerate.delete('/DeleteHash', DeleteHashHandler);

export default routerGenerate;
