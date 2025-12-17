const API_URL = '/api/auth';

document.addEventListener('DOMContentLoaded', () => {

    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            try {
                // Loading State
                const originalText = submitBtn.innerText;
                submitBtn.innerText = 'Signing In...';
                submitBtn.disabled = true;

                const response = await fetch(`${API_URL}/signin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Success
                    localStorage.setItem('user', JSON.stringify(data));
                    // Redirect based on role (simplistic for now)
                    if (data.roles.includes('ADMIN')) {
                        window.location.href = 'admin-dashboard.html';
                    } else if (data.roles.includes('COLLEGE')) {
                        window.location.href = 'college-dashboard.html';
                    } else {
                        window.location.href = 'student-dashboard.html';
                    }
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Is the backend running?');
            } finally {
                submitBtn.innerText = 'Sign In';
                submitBtn.disabled = false;
            }
        });
    }

    // Register Form Handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = registerForm.querySelector('button[type="submit"]');

            const role = document.getElementById('role').value;
            const payload = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                role: role.toUpperCase()
            };

            if (role === 'student') {
                payload.collegeName = document.getElementById('collegeName').value;
                payload.branch = document.getElementById('branch').value;
                payload.year = document.getElementById('year').value;
            } else {
                // For College Role, the primary name field acts as College Name
                payload.location = document.getElementById('location').value;
                payload.contactEmail = document.getElementById('contactEmail').value;
            }

            try {
                // Loading State
                submitBtn.innerText = 'Creating Account...';
                submitBtn.disabled = true;

                const response = await fetch(`${API_URL}/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Registration successful! Please login.');
                    window.location.href = 'login.html';
                } else {
                    alert(data.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Is the backend running?');
            } finally {
                submitBtn.innerText = 'Create Account';
                submitBtn.disabled = false;
            }
        });
    }
});
