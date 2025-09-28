const logArea = document.getElementById('log');
const startBtn = document.getElementById('startBtn');

function log(message) {
  const timestamp = new Date().toISOString();
  logArea.value += `[${timestamp}] ${message}\n`;
  logArea.scrollTop = logArea.scrollHeight;
}

async function startFlow() {
  logArea.value = '';
  log('Starting mock CIBA flow...');

  try {
    const requestResponse = await fetch('/api/ciba/auth/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-openbanking-nonce': crypto.randomUUID(),
      },
      body: JSON.stringify({
        client_id: 'demo-client',
        login_hint: 'national-id:1234567890',
        scope: 'accounts consents',
      }),
    });

    const requestData = await requestResponse.json();
    log(`Auth request issued: ${JSON.stringify(requestData)}`);

    await fetch('/api/mock/nafath/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auth_req_id: requestData.auth_req_id, subject: 'nafath-user' }),
    });
    log('Mock Nafath approval submitted.');

    const tokenResponse = await fetch('/api/ciba/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auth_req_id: requestData.auth_req_id }),
    });
    const tokenData = await tokenResponse.json();
    log(`Token response: ${JSON.stringify(tokenData)}`);
  } catch (error) {
    log(`Error: ${error}`);
  }
}

startBtn?.addEventListener('click', startFlow);
