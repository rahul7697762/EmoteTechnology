import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const testBunnyCDN = async () => {
    const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE;
    const ACCESS_KEY = process.env.BUNNY_ACCESS_KEY;
    const STORAGE_ENDPOINT = 'storage.bunnycdn.com';

    console.log('\n=== BunnyCDN Configuration Test ===');
    console.log(`Storage Zone: ${STORAGE_ZONE_NAME}`);
    console.log(`API Key: ${ACCESS_KEY ? `***${ACCESS_KEY.slice(-8)}` : 'NOT SET'}`);
    console.log(`Endpoint: ${STORAGE_ENDPOINT}`);

    if (!STORAGE_ZONE_NAME || !ACCESS_KEY) {
        console.error('\n❌ FAILED: Missing BUNNY_STORAGE_ZONE or BUNNY_ACCESS_KEY');
        process.exit(1);
    }

    // Test 1: List files in storage zone (verifies authentication)
    try {
        console.log('\n📋 Testing List Files (authentication check)...');
        const url = `https://${STORAGE_ENDPOINT}/${STORAGE_ZONE_NAME}/`;
        const res = await axios.get(url, {
            headers: {
                'AccessKey': ACCESS_KEY,
            }
        });
        console.log('✅ PASSED: Authentication successful');
        console.log(`   Response Status: ${res.status}`);
    } catch (error) {
        console.error('❌ FAILED: Authentication failed');
        console.error(`   Status: ${error.response?.status}`);
        console.error(`   Message: ${error.response?.data?.Message || error.message}`);
        console.log('\n⚠️  ACTION REQUIRED:');
        console.log('   1. Go to https://bunnycdn.com/account/storage');
        console.log(`   2. Find storage zone: "${STORAGE_ZONE_NAME}"`);
        console.log('   3. Click on it and find the "API Access" section');
        console.log('   4. Copy the "Storage API Key" (NOT Pullzone API Key)');
        console.log('   5. Update BUNNY_ACCESS_KEY in .env file');
        console.log('   6. Restart the server');
        process.exit(1);
    }

    // Test 2: Upload a small test file
    try {
        console.log('\n📤 Testing File Upload...');
        const testFileName = `test-${Date.now()}.txt`;
        const testContent = Buffer.from('Test file from Node.js');
        const url = `https://${STORAGE_ENDPOINT}/${STORAGE_ZONE_NAME}/test/${testFileName}`;

        const res = await axios.put(url, testContent, {
            headers: {
                'AccessKey': ACCESS_KEY,
                'Content-Type': 'text/plain',
            }
        });
        console.log('✅ PASSED: File upload successful');
        console.log(`   Status: ${res.status}`);
        console.log(`   File: test/${testFileName}`);

        // Test 3: Delete the test file
        try {
            console.log('\n🗑️  Cleaning up test file...');
            const deleteUrl = `https://${STORAGE_ENDPOINT}/${STORAGE_ZONE_NAME}/test/${testFileName}`;
            await axios.delete(deleteUrl, {
                headers: {
                    'AccessKey': ACCESS_KEY,
                }
            });
            console.log('✅ PASSED: File deleted successfully');
        } catch (deleteError) {
            console.warn('⚠️  Warning: Could not delete test file');
        }
    } catch (error) {
        console.error('❌ FAILED: File upload failed');
        console.error(`   Status: ${error.response?.status}`);
        console.error(`   Message: ${error.response?.data?.Message || error.message}`);
        process.exit(1);
    }

    console.log('\n✅ All tests passed! BunnyCDN is configured correctly.\n');
};

testBunnyCDN();
