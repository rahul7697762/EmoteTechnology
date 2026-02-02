const testAuth = async () => {
    const API_URL = 'http://localhost:5000/api/auth';
    const email = `testuser_${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`Testing with email: ${email}`);

    try {
        // 1. Signup
        console.log('\n--- Testing Signup ---');
        const signupRes = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email,
                password,
                role: 'STUDENT',
                phone: '1234567890'
            })
        });
        const signupData = await signupRes.json();
        console.log('Status:', signupRes.status);
        console.log('Response:', signupData);

        if (!signupRes.ok) throw new Error('Signup failed');

        // 2. Login
        console.log('\n--- Testing Login ---');
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password
            })
        });
        const loginData = await loginRes.json();
        console.log('Status:', loginRes.status);
        console.log('Response:', loginData);

    } catch (error) {
        console.error('Test failed:', error);
    }
};

testAuth();
