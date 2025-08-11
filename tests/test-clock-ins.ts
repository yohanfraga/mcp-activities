import 'dotenv/config';
import getLatestClockIns from '../src/utils/get-latest-clock-ins.js';
import Login from '../src/utils/login.js';

async function testGetLatestClockIns() {
    try {
        const cookies = await Login({ email: process.env.EMAIL || '', password: process.env.PASSWORD || '' });
        
        if (!cookies) {
            console.error('Please set login credentials in .env file');
            console.log('Example: EMAIL=your@email.com PASSWORD=yourpassword');
            return;
        }

        console.log('Fetching latest clock-ins...');
        const result = await getLatestClockIns(cookies);
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}

testGetLatestClockIns(); 