
const BASE_URL = 'http://localhost:3000/api';

async function testChat() {
    console.log('\n--- Testing /api/chat ---');
    try {
        const payload = {
            history: [
                { role: 'user', content: 'Hello, this is a test message to verify the API.' }
            ]
        };

        console.log('Sending payload:', JSON.stringify(payload, null, 2));
        const start = Date.now();
        const res = await fetch(`${BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        const duration = Date.now() - start;

        if (res.ok) {
            console.log(`✅ Success (${duration}ms)`);
            console.log('Response:', JSON.stringify(data, null, 2));
        } else {
            console.error(`❌ Failed (${res.status})`);
            console.error('Error Response:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('❌ Network/Server Error:', error.message);
    }
}

async function testHistory() {
    console.log('\n--- Testing /api/history (SAVE) ---');
    try {
        const payload = {
            messages: [
                { role: 'user', content: 'I have a headache.' },
                { role: 'assistant', content: 'I understand. Is it throbbing?' }
            ],
            summary: 'Headache consultation test',
            remedy: 'Nux Vomica'
        };

        const res = await fetch(`${BASE_URL}/history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok) {
            console.log('✅ Save Success');
            console.log('Response:', data);
        } else {
            console.error(`❌ Save Failed (${res.status})`, data);
        }
    } catch (error) {
        console.error('❌ History Save Error:', error.message);
    }

    console.log('\n--- Testing /api/history (GET) ---');
    try {
        const res = await fetch(`${BASE_URL}/history`);
        const data = await res.json();

        if (res.ok) {
            console.log(`✅ List Success. Count: ${data.length}`);
            if (data.length > 0) {
                console.log('Latest Entry Summary:', data[0].summary);
            }
        } else {
            console.error(`❌ List Failed (${res.status})`, data);
        }
    } catch (error) {
        console.error('❌ History List Error:', error.message);
    }
}

async function runTests() {
    console.log('Starting API Tests...');
    await testChat();
    // Wait a bit just in case of race conditions or rate limits, though unlikely for history
    await new Promise(r => setTimeout(r, 1000));
    await testHistory();
    console.log('\nTests Completed.');
}

runTests();
