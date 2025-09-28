const render = (element, value) => {
  const target = document.getElementById(element);
  if (target) {
    target.textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  }
};

const authForm = document.getElementById('auth-form');
const nafathForm = document.getElementById('nafath-form');
const tokenForm = document.getElementById('token-form');

const randomNonce = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

authForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const nonce = randomNonce();
  const clientId = document.getElementById('clientId').value;
  const scopes = document.getElementById('scopes').value;
  const bearerToken = document.getElementById('bearerToken').value;

  try {
    const response = await fetch('/ciba/auth/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
        'x-jti': nonce
      },
      body: JSON.stringify({ client_id: clientId, scope: scopes })
    });

    const data = await response.json();
    render('auth-response', data);

    if (data.auth_req_id) {
      document.getElementById('nafathAuthId').value = data.auth_req_id;
      document.getElementById('tokenAuthId').value = data.auth_req_id;
    }
  } catch (error) {
    render('auth-response', { error: error.message });
  }
});

nafathForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const action = event.submitter?.dataset?.action ?? 'approve';
  const endpoint = action === 'deny' ? '/mock/nafath/deny' : '/mock/nafath/approve';
  const authReqId = document.getElementById('nafathAuthId').value;
  const nationalId = document.getElementById('nationalId').value;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auth_req_id: authReqId, national_id: nationalId })
    });
    render('nafath-response', await response.json());
  } catch (error) {
    render('nafath-response', { error: error.message });
  }
});

tokenForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const authReqId = document.getElementById('tokenAuthId').value;

  try {
    const response = await fetch('/ciba/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${document.getElementById('bearerToken').value}`,
        'x-jti': randomNonce()
      },
      body: JSON.stringify({ auth_req_id: authReqId })
    });

    const data = await response.json();
    render('token-response', data);
  } catch (error) {
    render('token-response', { error: error.message });
  }
});
