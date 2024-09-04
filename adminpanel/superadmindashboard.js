document.addEventListener('DOMContentLoaded', function () {
  const organizations = [
    { id: 1, name: 'Organization 1', AliasName: 'Alias Name Org 1', admin: { name: 'John Doe', email: 'johndoe@example.com', phone: '408-996-1010', city: 'New York', country: 'America', opportunitiesApplied: 32, opportunitiesWon: 26, currentOpportunities: 6, managedOrganizations: ['Sub Organization 1', 'Sub Organization 2'] } },
    { id: 2, name: 'Organization 2', AliasName: 'Alias Name Org 2', admin: { name: 'Jane Doe', email: 'janedoe@example.com', phone: '408-996-1011', city: 'San Francisco', country: 'America', opportunitiesApplied: 12, opportunitiesWon: 10, currentOpportunities: 2, managedOrganizations: ['Sub Organization A', 'Sub Organization B'] } }
  ];

  const organizationListElement = document.getElementById('organizations');
  const fallbackMessage = document.getElementById('fallback-message');
  const userDetailsContainer = document.getElementById('user-details');
  const addOrganizationButton = document.getElementById('add-organization-button');
  const organizationModal = document.getElementById('organization-modal');
  const closeButton = document.querySelector('.close-button');
  const organizationForm = document.getElementById('organization-form');
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
          <span class="organization-description">${org.description}</span>
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
    userDetailsContainer.innerHTML = `
      <div class="user-details-header">
        <img src="https://via.placeholder.com/80" alt="${admin.name}">
        <h3>${admin.name}<br><small>${admin.email}</small></h3>
      </div>
      <div class="user-details-body">
        <div class="column">
          <label>Phone Number:</label>
          <p>${admin.phone}</p>
          <label>City:</label>
          <p>${admin.city}</p>
          <label>Country:</label>
          <p>${admin.country}</p>
        </div>
        <div class="column">
          <label>Opportunities Applied:</label>
          <p>${admin.opportunitiesApplied}</p>
          <label>Opportunities Won:</label>
          <p>${admin.opportunitiesWon}</p>
          <label>Current Opportunities:</label>
          <p>${admin.currentOpportunities}</p>
        </div>
      </div>
      <h3>Managed Organizations:</h3>
      <ul id="managed-organizations">
        ${admin.managedOrganizations.map(org => `<li>${org}</li>`).join('')}
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
    organizationForm['org-admin-gender'].value = org.admin.gender.toLowerCase();
    organizationForm['org-admin-address'].value = org.admin.address;
    organizationForm['org-admin-mobile'].value = org.admin.phone;
    organizationModal.style.display = 'block';
  }

  function openAddOrganizationModal() {
    editingOrgId = null;
    document.getElementById('modal-title').textContent = 'Add Organization';
    organizationForm.reset();
    organizationModal.style.display = 'block';
  }

  function closeModal() {
    organizationModal.style.display = 'none';
  }

  function deleteOrganization(orgId) {
    organizations = organizations.filter(org => org.id !== orgId);
    renderOrganizations();
    userDetailsContainer.style.display = 'none'; // Hide details if the selected organization is deleted
  }

  organizationForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const newOrg = {
      id: editingOrgId || Date.now(),
      name: organizationForm['org-name'].value,
      description: organizationForm['org-admin-name'].value, // Adjusted according to admin's name
      admin: {
        name: organizationForm['org-admin-name'].value,
        email: organizationForm['org-admin-email'].value,
        phone: organizationForm['org-admin-mobile'].value,
        city: 'New City', // For simplicity, using hardcoded values; adjust as needed
        country: 'New Country',
        opportunitiesApplied: 0,
        opportunitiesWon: 0,
        currentOpportunities: 0,
        managedOrganizations: []
      }
    };

    if (editingOrgId) {
      const index = organizations.findIndex(org => org.id === editingOrgId);
      organizations[index] = newOrg;
    } else {
      organizations.push(newOrg);
    }

    closeModal();
    renderOrganizations();
  });

  addOrganizationButton.addEventListener('click', openAddOrganizationModal);
  closeButton.addEventListener('click', closeModal);

  renderOrganizations();
});