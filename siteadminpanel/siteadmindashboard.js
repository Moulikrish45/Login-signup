document.addEventListener('DOMContentLoaded', function () {
  const API_GET_ORGANIZATIONS = 'https://mdashttptriggersfunctionapp.azurewebsites.net/api/getUserList?code=RNqEbinzwcqGRnHlgTdFrOWhhwe2q7OVZ5HeB5kN9cgMAzFurgLtbA%3D%3D';
  const API_CREATE_USER = 'https://mdashttptriggersfunctionapp.azurewebsites.net/api/createuser?';

  let organizations = []; // Start with an empty array for dynamic updates

  const organizationListElement = document.getElementById('organizations');
  const fallbackMessage = document.getElementById('fallback-message');
  const userDetailsContainer = document.getElementById('user-details');
  const addOrganizationButton = document.getElementById('add-organization-button');
  const organizationModal = document.getElementById('organization-modal');
  const closeButton = document.querySelector('.close-button');
  const organizationForm = document.getElementById('organization-form');
  const modalOverlay = document.getElementById('modal-overlay');
  const mainContent = document.querySelector('.container');
  let editingOrgId = null; // To track the organization being edited

  // QR Scanner setup
  const qrScannerContainer = document.createElement('div');
  qrScannerContainer.id = 'qr-scanner-container';
  qrScannerContainer.style.display = 'none';
  qrScannerContainer.innerHTML = `
      <div id="qr-reader" style="width: 300px; height: 300px;"></div>
      <button id="stop-qr-scan-button">Stop Scanning</button>
  `;
  document.body.appendChild(qrScannerContainer);
  const qrReaderElement = document.getElementById('qr-reader');
  const stopQrScanButton = document.getElementById('stop-qr-scan-button');
  let qrScanner = null;

  function openQrScanner() {
    // Show QR scanner and overlay
    qrScannerContainer.style.display = 'block'; // Show QR scanner
    modalOverlay.style.display = 'block'; // Show overlay

    qrScanner = new Html5Qrcode("qr-reader");
    qrScanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      },
      qrCodeMessage => {
        console.log(`QR Code scanned: ${qrCodeMessage}`);
        handleQrCodeData(qrCodeMessage);
        closeQrScanner();
      },
      errorMessage => {
        console.error(`QR Code scan error: ${errorMessage}`);
      }
    ).catch(err => {
      console.error(`QR Code scanning failed: ${err}`);
    });
  }

  function closeQrScanner() {
    if (qrScanner) {
      qrScanner.stop().then(() => {
        qrScanner.clear();
        qrScannerContainer.style.display = 'none'; // Hide QR scanner
        modalOverlay.style.display = 'none'; // Hide overlay
      }).catch(err => {
        console.error(`Failed to close QR scanner: ${err}`);
      });
    }
  }


  function handleQrCodeData(qrData) {
    // Combine the data from the form and the QR code
    const formData = {
      userId: organizationForm['org-name'].value,
      pcId: organizationForm['org-admin-name'].value,
      email: organizationForm['org-admin-email'].value,
      password: organizationForm['org-admin-password'].value,
      address: organizationForm['org-admin-address'].value,
      mobile: organizationForm['org-admin-mobile'].value,
      qrCode: qrData
    };

    // Log to console (send to API in actual implementation)
    console.log('Form and QR Data:', formData);
    // You can now send formData to your API
  }

  function renderOrganizations() {
    if (organizations.length === 0) {
      fallbackMessage.style.display = 'block';
    } else {
      fallbackMessage.style.display = 'none';
      organizationListElement.innerHTML = '';
      organizations.forEach(org => {
        const li = document.createElement('li');
        li.classList.add('organization-item');
        li.innerHTML = `
                  <span class="organization-name">${org.user_name}</span>
                  <span class="organization-description">${org.user_email}</span>
                  <div class="organization-actions">
                      <button class="edit-button">Edit</button>
                      <button class="delete-button">Delete</button>
                  </div>
              `;
        li.querySelector('.edit-button').addEventListener('click', (e) => {
          e.stopPropagation();
          openEditOrganizationModal(org);
        });
        li.querySelector('.delete-button').addEventListener('click', (e) => {
          e.stopPropagation();
          deleteOrganization(org.user_id);
        });
        li.addEventListener('click', () => showUserDetails(org));
        organizationListElement.appendChild(li);
      });
    }
  }

  function showUserDetails(admin) {
    userDetailsContainer.innerHTML = `
          <div class="user-details-header">
              <h3>${admin.user_name}<br><small>${admin.user_email}</small></h3>
          </div>
          <div class="user-details-body">
              <div class="column">
                  <label>Phone Number:</label>
                  <p>${admin.user_mobile_1}</p>
              </div>
              <div class="column">
                  <label>Address:</label>
                  <p>${admin.user_address}</p>
              </div>
          </div>
      `;
    userDetailsContainer.style.display = 'block';
  }

  function openEditOrganizationModal(org) {
    editingOrgId = org.user_id;
    document.getElementById('modal-title').textContent = 'Edit Organization';
    organizationForm['org-name'].value = org.user_name;
    organizationForm['org-admin-name'].value = org.user_name;
    organizationForm['org-admin-email'].value = org.user_email;
    organizationForm['org-admin-password'].value = ''; // Leave empty for security reasons
    organizationForm['org-admin-repeat-password'].value = ''; // Leave empty for security reasons
    organizationForm['org-admin-address'].value = org.user_address || ''; // Default to empty string if not defined
    organizationForm['org-admin-mobile'].value = org.user_mobile_1 || ''; // Default to empty string if not defined

    // Show overlay and blur background
    if (modalOverlay) {
      modalOverlay.classList.add('modal-show');
    }
    if (organizationModal) {
      organizationModal.style.display = 'block';
    } else {
      console.error('organizationModal is not found.');
    }
    if (mainContent) {
      mainContent.classList.add('blur-background');
    }
  }

  function openAddOrganizationModal() {
    editingOrgId = null;
    document.getElementById('modal-title').textContent = 'Add Organization';
    organizationForm.reset();
    if (modalOverlay) {
      modalOverlay.classList.add('modal-show');
    }
    if (organizationModal) {
      organizationModal.style.display = 'block';
    } else {
      console.error('organizationModal is not found.');
    }
    if (mainContent) {
      mainContent.classList.add('blur-background');
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('modal-show'); // Hide the overlay
    }
    if (organizationModal) {
      organizationModal.style.display = 'none'; // Hide the modal
    }
    if (mainContent) {
      mainContent.classList.remove('blur-background'); // Remove the blur effect
    }
  }

  function deleteOrganization(orgId) {
    const updatedOrganizations = organizations.filter(org => org.user_id !== orgId);

    organizations.length = 0; // Clear the original array
    organizations.push(...updatedOrganizations); // Push the filtered organizations back

    renderOrganizations();
    userDetailsContainer.style.display = 'none'; // Hide details if the selected organization is deleted
  }

  // Handle form submission to open QR scanner
  organizationForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // Hide form and show QR scanner
    organizationModal.style.display = 'none';
    openQrScanner();
  });

  // Stop QR scanning manually
  stopQrScanButton.addEventListener('click', closeQrScanner);

  addOrganizationButton.addEventListener('click', openAddOrganizationModal);
  closeButton.addEventListener('click', closeModal);

  function retrieveOrganizations() {
    const token = getSessionToken();
    if (!token) {
      window.location.href = '/login&signup/login.html'; // Redirect to login if no token
      return;
    }

    // Prepare request body
    const requestBody = {
      userrole: 'Admin'
    };

    fetch(API_GET_ORGANIZATIONS, {
      method: 'POST', // Using POST method
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          organizations.length = 0; // Clear the array
          organizations.push(...data); // Populate the array
          renderOrganizations();
        } else {
          console.error('Received data is not an array', data);
        }
      })
      .catch(error => {
        console.error('Failed to retrieve organizations:', error);
      });
  }

  retrieveOrganizations();

  function createAdminUser(org) {
    const token = getSessionToken(); // Retrieve token from cookies

    if (!token) {
      alert('Session expired. Please log in again.');
      window.location.href = '/login&signup/login.html'; // Redirect to login if no token
      return;
    }

    const requestBody = {
      useremail: org.user_email,
      password: organizationForm['org-admin-password'].value, // Use the password from the form
      userrole: 'Admin',
      address: org.user_address,
      adminName: org.user_name,
      organizationName: org.user_name,
      mobileNumber: org.user_mobile_1,
      gender: org.user_gender
    };

    fetch(API_CREATE_USER, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => response.text())
      .then(data => {
        console.log('API Response:', data);
        if (data.includes('User created successfully')) {
          alert('Admin user created successfully.');
        } else if (data.includes('Duplicate entry')) {
          alert('User already exists.');
        } else {
          alert('An error occurred while creating the user.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to create admin user.');
      });
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

  renderOrganizations(); // Initial render on page
});