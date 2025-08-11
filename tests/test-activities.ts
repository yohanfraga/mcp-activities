import 'dotenv/config';
import getLatestActivities from '../src/utils/get-latest-activities.js';
import Login from '../src/utils/login.js';

async function testGetLatestActivities() {
    try {
        const cookies = await Login({ email: process.env.EMAIL || '', password: process.env.PASSWORD || '' });
        
        if (!cookies) {
            console.error('Please set login credentials in .env file');
            console.log('Example: EMAIL=your@email.com PASSWORD=yourpassword');
            return;
        }

        console.log('Fetching latest activities...');
        const result = await getLatestActivities(cookies);
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}

testGetLatestActivities(); 