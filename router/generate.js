import express from 'express';
import { Generate, getdata_gen, getByHash, DecryptHash, GenerateSHA, UPDateHash, DeleteHash, } from '../controller/generate.js';

const router = express.Router();

router.post('/hash', Generate);
router.post('/hashSHA', GenerateSHA);
router.post('/decrypthash', DecryptHash);
router.get('/getdata', getdata_gen);
router.get('/ByHash', getByHash);
router.get('/ByHash', getByHash);
router.patch('/updatehash', UPDateHash )
router.delete('/DeleteHash', DeleteHash )

export default router;