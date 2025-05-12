document.getElementById('eye-icon').addEventListener('click', pass);

let isPasswordVisible = false; // Track password visibility

function pass() {
  const passwordInput = document.getElementById('pass');
  const eyeIcon = document.getElementById('eye-icon');
  console.log('Eye icon clicked'); // Debugging

  if (isPasswordVisible) {
    passwordInput.type = 'password';
    eyeIcon.src = './images/pass-hide.png';
    isPasswordVisible = false;
    console.log('Password hidden'); // Debugging
  } else {
    passwordInput.type = 'text';
    eyeIcon.src = './images/pass-show.png';
    isPasswordVisible = true;
    console.log('Password shown'); // Debugging
  }
}

document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent the default form submission behavior

  const username = document.getElementById('userName').value;
  const password = document.getElementById('pass').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (result.success) {
      // Store the JWT token in localStorage
      localStorage.setItem('token', result.token);

      // Redirect to the game page
      window.location.href = '/game';
    } else {
      // Display an error message if login fails
      document.getElementById('loginMessage').textContent = result.message;
      document.getElementById('loginMessage').style.color = 'red';
    }
  } catch (error) {
    console.error('Error during login:', error);
    document.getElementById('loginMessage').textContent = 'An error occurred. Please try again.';
    document.getElementById('loginMessage').style.color = 'red';
  }
});

document.getElementById('createAccountLink').addEventListener('click', () => {
  window.location.href = '/create-account'; // Redirect to the create account page
});

// Clear session data and token when the login page is loaded
window.addEventListener('load', () => {
  localStorage.removeItem('token'); // Clear the token
  sessionStorage.clear(); // Clear session data
});