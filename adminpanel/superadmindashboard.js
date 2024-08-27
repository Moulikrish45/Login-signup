document.addEventListener('DOMContentLoaded', function() {
    const organizationList = document.getElementById('organizations');
    const addOrganizationButton = document.getElementById('add-organization-button');
    const organizationModal = document.getElementById('organization-modal');
    const closeButton = document.querySelector('.close-button');
    const saveOrganizationButton = document.getElementById('save-organization-button');
    const organizationForm = document.getElementById('organization-form');
    const modalTitle = document.getElementById('modal-title');
    
    let organizations = [];
    let editIndex = null;
  
    // Mock Data for demonstration
    organizations = [
      { id: 1, name: 'Organization 1', description: 'Description for Organization 1' },
      { id: 2, name: 'Organization 2', description: 'Description for Organization 2' }
    ];
  
    // Function to render the list of organizations
    function renderOrganizations() {
      organizationList.innerHTML = '';
      organizations.forEach((org, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${org.name}</strong>
          <p>${org.description}</p>
          <button onclick="editOrganization(${index})">Edit</button>
          <button onclick="deleteOrganization(${index})">Delete</button>
        `;
        organizationList.appendChild(li);
      });
    }
  
    // Function to open the modal
    function openModal() {
      organizationModal.style.display = 'block';
    }
  
    // Function to close the modal
    function closeModal() {
      organizationModal.style.display = 'none';
      organizationForm.reset();
      editIndex = null;
    }
  
    // Function to handle Add/Edit Organization
    organizationForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const name = document.getElementById('org-name').value;
      const description = document.getElementById('org-description').value;
  
      if (editIndex === null) {
        // Add new organization
        const newOrg = { id: organizations.length + 1, name, description };
        organizations.push(newOrg);
      } else {
        // Edit existing organization
        organizations[editIndex].name = name;
        organizations[editIndex].description = description;
      }
      
      closeModal();
      renderOrganizations();
    });
  
    // Function to edit an organization
    window.editOrganization = function(index) {
      editIndex = index;
      const org = organizations[index];
      document.getElementById('org-name').value = org.name;
      document.getElementById('org-description').value = org.description;
      modalTitle.textContent = 'Edit Organization';
      openModal();
    }
  
    // Function to delete an organization
    window.deleteOrganization = function(index) {
      organizations.splice(index, 1);
      renderOrganizations();
    }
  
    // Event listeners
    addOrganizationButton.addEventListener('click', function() {
      modalTitle.textContent = 'Add Organization';
      openModal();
    });
  
    closeButton.addEventListener('click', closeModal);
  
    // Initial render
    renderOrganizations();
  });
  