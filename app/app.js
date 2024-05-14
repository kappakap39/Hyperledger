import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import config from '../config/config.js';
import router_ver01 from '../router/router_ver01.js';
import errorHandler from '../middleware/errorHandler.js'
import fourOhFour from '../middleware/fourOhFour.js'

// สร้างแอป Express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: config.clientOrigins[config.nodeEnv],
    }),
);
app.use(helmet());
app.use(morgan('tiny'));

app.use('/ver01', router_ver01);

// Apply error handling last
app.use(fourOhFour);
app.use(errorHandler);

export default app;