const loginForm = document.getElementById('login-form');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const error_message = document.getElementById('error-message');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    error_message.innerText = '';

    const errors = validateLoginForm(email_input.value, password_input.value);

    if (errors.length > 0) {
        error_message.innerText = errors.join('. ') + '.';
        return;
    }

    // Prepare the login credentials
    const userEmail = email_input.value.trim();
    const userPassword = password_input.value.trim();

    // Debugging log for the login data
    console.log('Login Data as JSON:', JSON.stringify({ useremail: userEmail, password: userPassword }));

    const API_ENDPOINT = "https://mdashttptriggersfunctionapp.azurewebsites.net/api/login?code=6hFGwVi9hKu225MkC1AIoeyEbrSxKtvNFSP1CC6Z9R_8AzFukajfwg%3D%3D"
    fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ useremail: userEmail, password: userPassword }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json().catch(() => {
            throw new Error('Failed to parse JSON');
        });
    })
    .then(data => {
        if (data.status === "verified") {
            setSessionToken(data.token);
            alert(`Login Successful! Role: ${data.role}`);
            redirectToDashboard(data.role);
        } else {
            throw new Error('Login failed: ' + data.status);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        error_message.innerText = 'Login failed. Please check your email and password and try again.';
    });
});

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

function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function setSessionToken(token) {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1); // Token expires in 1 hour

    document.cookie = `sessionToken=${token}; Secure; SameSite=Secure;Path=/; Expires=${expiryDate.toUTCString()};`;
}

function getSessionToken() {
    const name = "sessionToken=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

// Function to redirect user to the appropriate dashboard based on their role
function redirectToDashboard(role) {
    switch(role) {
        case 'Owner':
            window.location.href = '/adminpanel/admin_panel_dashboard.html';
            break;
        case 'Site Admin':
            window.location.href = '/siteadminpanel/site_admin_dashboard.html';
            break;
        case 'Super Admin':
            window.location.href = '/superadminpanel/super_admin_dashboard.html';
            break;
        case 'Organizational Admin':
            window.location.href = '/organizationadminpanel/organization_admin_dashboard.html';
            break;
        case 'PC Admin':
            window.location.href = '/pcadminpanel/pc_admin_dashboard.html';

        // Waiting for other roles and their corresponding dashboards here
        default:
            window.location.href = '/Not_Found_Error_404.html';
    }
}

// Function to make an authenticated request using the session token
function makeAuthenticatedRequest(url, method = 'GET') {
    const token = getSessionToken();
    if (!token) {
        alert('Session expired. Please log in again.');
        window.location.href = '/login.html'; // Redirect to login if no token
        return;
    }

    return fetch(url, {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}

// Example function to test secure endpoint access
function testSecureEndpoint() {
    const secureUrl = 'https://mdashttptriggersfunctionapp.azurewebsites.net/api/secure-endpoint?code=HBk6IFqkaFNRxbu2zbj-RG-SnGYnRBR3HlQR9meFYQwiAzFugyY7NQ%3D%3D';
    makeAuthenticatedRequest(secureUrl)
        .then(response => response.text())
        .then(data => console.log('Secure endpoint response:', data))
        .catch(error => console.error('Error accessing secure endpoint:', error));
}

// Call the test function on page load to ensure the session is valid
document.addEventListener('DOMContentLoaded', () => {
    if (getSessionToken()) {
        testSecureEndpoint();
    }
});
