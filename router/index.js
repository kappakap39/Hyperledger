import express from 'express';

import config from '../../config';

import authRoute from './auth.route';
import docsRoute from './docs.route';
import chatRoute from './chat.route';
import templateRoute from './template.route';
import categoryRoute from './category.route';
import transcriptionRoute from './transcription.route';
import modelRoute from './model.route';
import documentRoute from './document.route';
import userLogRoute from './userLog.route';
import messageRoute from './message.route';
import presentationRoute from './Presentation.route';
import usageRoute from './usage.route';
import userRoute from './user.route';
import fileRoute from './file.route';

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/chat',
        route: chatRoute,
    },
    {
        path: '/template',
        route: templateRoute,
    },
    {
        path: '/category',
        route: categoryRoute,
    },
    {
        path: '/transcription',
        route: transcriptionRoute,
    },
    {
        path: '/model',
        route: modelRoute,
    },
    {
        path: '/document',
        route: documentRoute,
    },
    {
        path: '/userLog',
        route: userLogRoute,
    },
    {
        path: '/messages',
        route: messageRoute,
    },
    {
        path: '/presentation',
        route: presentationRoute,
    },
    {
        path: '/usage',
        route: usageRoute,
    },
    {
        path: '/file',
        route: fileRoute,
    },
    {
        path: '/user',
        route: userRoute,
    },
];

const devRoutes = [
    {
        path: '/docs',
        route: docsRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

if (config.nodeEnv === 'development') {
    devRoutes.forEach((route) => {
        router.use(route.path, route.route);
    });
}

export default router;
