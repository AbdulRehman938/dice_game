// Attach DOM-dependent listeners after DOM is ready and guard elements
document.addEventListener('DOMContentLoaded', () => {
  let isPasswordVisible = false; // Track password visibility

  function pass() {
    const passwordInput = document.getElementById('pass');
    const eyeIcon = document.getElementById('eye-icon');
    if (!passwordInput || !eyeIcon) return;

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

  const eyeIconEl = document.getElementById('eye-icon');
  if (eyeIconEl) eyeIconEl.addEventListener('click', pass);

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (event) {
      event.preventDefault(); // Prevent the default form submission behavior

      const username = document.getElementById('userName')?.value;
      const password = document.getElementById('pass')?.value;

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
          const msgEl = document.getElementById('loginMessage');
          if (msgEl) {
            msgEl.textContent = result.message;
            msgEl.style.color = 'red';
          }
        }
      } catch (error) {
        console.error('Error during login:', error);
        const msgEl = document.getElementById('loginMessage');
        if (msgEl) {
          msgEl.textContent = 'An error occurred. Please try again.';
          msgEl.style.color = 'red';
        }
      }
    });
  }

  const createAccountLink = document.getElementById('createAccountLink');
  if (createAccountLink) {
    // Keep behavior consistent for users with JS enabled
    createAccountLink.addEventListener('click', (e) => {
      // If it's an anchor with href, allow default navigation
      if (createAccountLink.tagName.toLowerCase() === 'a') return;
      e.preventDefault();
      window.location.href = '/create-account'; // Redirect to the create account page
    });
  }

  // Clear session data and token when the login page is loaded
  localStorage.removeItem('token'); // Clear the token
  sessionStorage.clear(); // Clear session data
});