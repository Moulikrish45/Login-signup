const form = document.getElementById('form');
const firstname_input = document.getElementById('firstname-input');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const repeat_password_input = document.getElementById('repeat-password-input');
const error_message = document.getElementById('error-message');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the form from submitting the traditional way

  let errors = getSignupFormErrors(firstname_input.value, email_input.value, password_input.value, repeat_password_input.value);

  if (errors.length > 0) {
    error_message.innerText = errors.join(". ");
  } else {
    submitForm(e);
  }
});

function getSignupFormErrors(firstname, email, password, repeatPassword) {
  let errors = [];

  if (firstname === '' || firstname == null) {
    errors.push('Firstname is required');
    firstname_input.parentElement.classList.add('incorrect');
  }
  if (email === '' || email == null) {
    errors.push('Email is required');
    email_input.parentElement.classList.add('incorrect');
  }
  if (password === '' || password == null) {
    errors.push('Password is required');
    password_input.parentElement.classList.add('incorrect');
  }
  if (password.length < 8) {
    errors.push('Password must have at least 8 characters');
    password_input.parentElement.classList.add('incorrect');
  }
  if (password !== repeatPassword) {
    errors.push('Password does not match repeated password');
    password_input.parentElement.classList.add('incorrect');
    repeat_password_input.parentElement.classList.add('incorrect');
  }

  return errors;
}

function submitForm(event) {
    event.preventDefault(); // Prevents the default form submission behavior

    const data = {
        firstname: firstname_input.value,
        email: email_input.value,
        password: password_input.value,
    };

    // Log the JSON data to the console
    console.log('Form Data as JSON:', JSON.stringify(data));

    // Placeholder for the API endpoint
    const API_ENDPOINT = 'https://placeholder-api-endpoint.com/signup';

    // Simulate the fetch request (this part is commented out since we're not making an actual API call)
    // fetch(API_ENDPOINT, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // })
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    // })
    // .then(data => {
    //     console.log('Success:', data);
    //     // Handle success scenario, maybe redirect to login page or show a success message
    // })
    // .catch((error) => {
    //     console.error('Error:', error);
    //     error_message.innerText = 'An error occurred during sign-up. Please try again later.';
    // });
}
