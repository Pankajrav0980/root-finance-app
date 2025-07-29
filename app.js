// frontend/app.js
const api = ''; // Backend base URL
function redirectIfUnauthorized() {
  if (!localStorage.getItem('token')) window.location = 'login.html';
}
if (window.location.pathname.endsWith('dashboard.html')) {
  redirectIfUnauthorized();
  fetchCustomers();
}
document.getElementById('loginForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const resp = await fetch(api + '/api/login', {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({ username:user.value, password:pass.value })
  });
  const d = await resp.json();
  if (resp.ok) localStorage.setItem('token', d.token), window.location = 'dashboard.html';
  else error.innerText = d.error;
});
document.getElementById('addForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    name:name.value, email:email.value, phone:phone.value,
    loan:+loan.value, interest:+interest.value,
    months:+months.value, startDate:startDate.value
  };
  await fetch(api + '/api/customers', {
    method:'POST',
    headers:{ 'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('token') },
    body: JSON.stringify(body)
  });
  fetchCustomers();
  e.target.reset();
});
async function fetchCustomers() {
  const resp = await fetch(api + '/api/customers', {
    headers:{ 'Authorization':'Bearer '+localStorage.getItem('token') }
  });
  const data = await resp.json();
  const tbody = document.getElementById('tbody'); tbody.innerHTML = '';
  data.forEach((c,i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = <td>${c.name}</td><td>₹${c.loan}</td><td>₹${c.emi}</td><td>₹${c.overdue}</td><td><button onclick="view(${i})">View</button></td>;
    tbody.appendChild(tr);
  });
  window.currentData = data;
}
function view(i) {
  const c = window.currentData[i];
  document.getElementById('detail').innerHTML = `
    <p><strong>Name:</strong> ${c.name}</p>
    <p><strong>Email:</strong> ${c.email}</p>
    <p><strong>Phone:</strong> ${c.phone}</p>
    <p><strong>Loan:</strong> ₹${c.loan}</p>
    <p><strong>EMI:</strong> ₹${c.emi}</p>
    <p><strong>Overdue:</strong> ₹${c.overdue}</p>
  `;
  document.getElementById('modal').style.display = 'flex';
}
document.getElementById('close')?.addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem('token'); window.location = 'login.html';
});
document.getElementById('exportPdf')?.addEventListener('click', () => {
  window.location = api + '/api/customers/pdf';
});