import app from './app/app.js';
import config from './config/config.js';

// เริ่มต้นเซิร์ฟเวอร์ที่พอร์ทที่กำหนด
app.listen(config.port, () => {
    console.log(`⚡️ ${config.name} ${config.version} ⚡️`);
    console.log(`⚡️ Listening on ${config.port} with NODE_ENV=${config.nodeEnv} ⚡️`);
});