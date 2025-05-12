function back() {
  window.location.href = '/login'; // Redirect to the login page
}

document.getElementById('login-btn2').addEventListener('click', back);

document.getElementById('createAccountForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const username = document.getElementById('newUsername').value;
  const password = document.getElementById('newPassword').value;
  const verifyPassword = document.getElementById('verifyPassword').value;

  if (password !== verifyPassword) {
    document.getElementById('createAccountMessage').textContent = 'Passwords do not match';
    document.getElementById('createAccountMessage').style.color = 'red';
    return;
  }

  try {
    const response = await fetch('/api/create-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, username, password, verifyPassword }),
    });

    const result = await response.json();
    if (result.success) {
      window.location.href = '/login'; // Redirect to the login page
    } else {
      document.getElementById('createAccountMessage').textContent = result.message;
      document.getElementById('createAccountMessage').style.color = 'red';
    }
  } catch (error) {
    console.error(error);
    document.getElementById('createAccountMessage').textContent = 'Error creating account';
    document.getElementById('createAccountMessage').style.color = 'red';
  }
});