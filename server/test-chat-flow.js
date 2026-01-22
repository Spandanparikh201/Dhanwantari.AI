const axios = require('axios');

async function testChatFlow() {
    const url = 'http://localhost:3000/api/chat';

    // 1. Initial greeting
    console.log('\n--- 1. Sending Initial Symptom ---');
    let history = [
        { role: 'user', content: 'I have a severe headache on my right side.' }
    ];

    try {
        let res = await axios.post(url, { history });
        console.log('AI Response:', res.data.content);
        history.push({ role: 'assistant', content: res.data.content });

        // 2. Answering Follow-up (Simulated)
        console.log('\n--- 2. Sending Follow-up Details ---');
        history.push({ role: 'user', content: 'It is throbbing and gets worse with light. I also feel nauseous.' });

        res = await axios.post(url, { history });
        console.log('AI Response:', res.data.content);
        history.push({ role: 'assistant', content: res.data.content });

        // 3. Forcing a conclusion (Simulated short cut for testing)
        console.log('\n--- 3. Asking for Remedy ---');
        history.push({ role: 'user', content: 'That is all. I feel irritable and just want to be left alone. What should I take?' });

        res = await axios.post(url, { history });
        console.log('AI Response:', res.data.content);

        if (res.data.prescription) {
            console.log('\n✅ PRESCRIPTION GENERATED!');
            console.log(JSON.stringify(res.data.prescription, null, 2));
        } else {
            console.log('\n⚠️ No prescription generated yet (this is normal if the AI needs more info).');
        }

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testChatFlow();
