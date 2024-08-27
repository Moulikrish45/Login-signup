const loginForm = document.getElementById('login-form');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const error_message = document.getElementById('error-message');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Clear previous error messages
    error_message.innerText = '';

    // Validate the user inputs
    const errors = validateLoginForm(email_input.value, password_input.value);

    if (errors.length > 0) {
        // If there are validation errors, display them to the user
        error_message.innerText = errors.join('. ') + '.';
        return;
    }

    const userEmail = email_input.value.trim();
    const userPassword = password_input.value.trim();

    // Log the JSON data to the console (for debugging purposes)
    console.log('Login Data as JSON:', JSON.stringify({ useremail: userEmail, password: userPassword }));

    // The API endpoint for login verification
    const API_ENDPOINT = 'https://mdashttptriggersfunctionapp.azurewebsites.net/api/verifyuser';

    // Make a POST request to the API with the email and password in the request body
    fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ useremail: userEmail, password: userPassword }),
    })
    .then(response => {
        console.log('Raw response:', response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json().catch(error => {
            throw new Error('Failed to parse JSON');
        });
    })
    .then(data => {
        console.log('Success:', data);
        if (data.status === "verified") {
            alert(`Login successful! Role: ${data.role}`);
            // Redirect to the appropriate dashboard based on role
            window.location.href = '/super_admin_dashboard.html';
        } else {
            throw new Error('Login failed: ' + data.status);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        error_message.innerText = 'Login failed. Please check your email and password and try again.';
    });
});

// Function to validate the login form inputs
function validateLoginForm(email, password) {
    let errors = [];

    if (!email || email.trim() === '') {
        errors.push('Email is required');
    } else if (!validateEmailFormat(email)) {
        errors.push('Please enter a valid email address');
    }

    if (!password || password.trim() === '') {
        errors.push('Password is required');
    } else if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    return errors;
}

// Function to validate the email format using a regular expression
function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
