document.addEventListener('DOMContentLoaded', function () {
  const API_GET_ORGANIZATIONS = 'https://mdashttptriggersfunctionapp.azurewebsites.net/api/getorganizations?';
  const API_CREATE_USER = 'https://mdashttptriggersfunctionapp.azurewebsites.net/api/createuser?';

  const organizations = [
    // Initial organizations for development/testing purposes
    { id: 1, name: 'Organization 1', AliasName: 'Alias Name Org 1', admin: { name: 'John Doe', email: 'johndoe@example.com', phone: '408-996-1010', managedOrganizations: ['Sub Organization 1', 'Sub Organization 2'] } },
    { id: 2, name: 'Organization 2', AliasName: 'Alias Name Org 2', admin: { name: 'Jane Doe', email: 'janedoe@example.com', phone: '408-996-1011', managedOrganizations: ['Sub Organization A', 'Sub Organization B'] } }
  ];

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
          <span class="organization-name">${org.name}</span>
          <span class="organization-description">${org.AliasName}</span>
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
          deleteOrganization(org.id);
        });
        li.addEventListener('click', () => showUserDetails(org.admin));
        organizationListElement.appendChild(li);
      });
    }
  }

  function showUserDetails(admin) {
    const managedOrgs = Array.isArray(admin.managedOrganizations) ? admin.managedOrganizations : [];
  
    userDetailsContainer.innerHTML = `
      <div class="user-details-header">
        <h3>${admin.name}<br><small>${admin.email}</small></h3>
      </div>
      <div class="user-details-body">
        <div class="column">
          <label>Phone Number:</label>
          <p>${admin.phone}</p>
        </div>
      </div>
      <h3>Managed Organizations:</h3>
      <ul id="managed-organizations">
        ${managedOrgs.map(org => `<li>${org}</li>`).join('')}
      </ul>
    `;
    userDetailsContainer.style.display = 'block';
  }

  function openEditOrganizationModal(org) {
    editingOrgId = org.id;
    document.getElementById('modal-title').textContent = 'Edit Organization';
    organizationForm['org-name'].value = org.name;
    organizationForm['org-admin-name'].value = org.admin.name;
    organizationForm['org-admin-email'].value = org.admin.email;
    organizationForm['org-admin-password'].value = ''; // Leave empty for security reasons
    organizationForm['org-admin-repeat-password'].value = ''; // Leave empty for security reasons
    const gender = org.admin.gender ? org.admin.gender.toLowerCase() : 'other';
    organizationForm['org-admin-gender'].value = gender;
    organizationForm['org-admin-address'].value = org.admin.address || ''; // Default to empty string if not defined
    organizationForm['org-admin-mobile'].value = org.admin.phone || ''; // Default to empty string if not defined
    
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
    const updatedOrganizations = organizations.filter(org => org.id !== orgId);
    
    organizations.length = 0; // Clear the original array
    organizations.push(...updatedOrganizations); // Push the filtered organizations back
  
    renderOrganizations();
    userDetailsContainer.style.display = 'none'; // Hide details if the selected organization is deleted
  }

  organizationForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const newOrg = {
      id: editingOrgId || Date.now(),
      name: organizationForm['org-name'].value,
      AliasName: organizationForm['org-admin-name'].value, // Adjusted according to admin's name
      admin: {
        name: organizationForm['org-admin-name'].value,
        email: organizationForm['org-admin-email'].value,
        phone: organizationForm['org-admin-mobile'].value,
        gender: organizationForm['org-admin-gender'].value,
        address: organizationForm['org-admin-address'].value
      }
    };

    if (editingOrgId) {
      const index = organizations.findIndex(org => org.id === editingOrgId);
      organizations[index] = newOrg;
    } else {
      organizations.push(newOrg);
    }

    // Create Admin (Owner) via API call
    createAdminUser(newOrg);

    closeModal();
    renderOrganizations();
  });

  addOrganizationButton.addEventListener('click', openAddOrganizationModal);
  closeButton.addEventListener('click', closeModal);

  function retrieveOrganizations() {
    const token = getSessionToken();
    if (!token) {
      window.location.href = '/login&signup/login.html'; // Redirect to login if no token
      return;
    }

    fetch(API_GET_ORGANIZATIONS, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data.organizations)) {
        organizations.length = 0; // Clear the array
        organizations.push(...data.organizations); // Populate it with new data
        renderOrganizations();
      } else {
        console.error('Unexpected response format:', data);
      }
    })
    .catch(error => {
      console.error('Error fetching organizations:', error);
    });
  }

  retrieveOrganizations(); // Fetch and display organizations on page load

  function createAdminUser(org) {
    const token = getSessionToken(); // Retrieve token from cookies

    if (!token) {
      alert('Session expired. Please log in again.');
      window.location.href = '/login&signup/login.html'; // Redirect to login if no token
      return;
    }

    const requestBody = {
      useremail: org.admin.email,
      password: organizationForm['org-admin-password'].value, // Use the password from the form
      userrole: 'Admin',
      address: org.admin.address,
      adminName: org.admin.name,
      organizationName: org.name,
      mobileNumber: org.admin.phone,
      gender: org.admin.gender
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

  renderOrganizations(); // Initial render on page load
});
