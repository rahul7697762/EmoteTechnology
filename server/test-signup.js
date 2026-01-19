// Quick test script to debug signup
import fetch from 'node-fetch';

const testSignup = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test User Debug',
                email: `test${Date.now()}@example.com`,
                password: 'password123',
                phone: '+1234567890'
            })
        });

        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
};

testSignup();
