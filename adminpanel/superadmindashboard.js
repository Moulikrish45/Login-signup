document.addEventListener('DOMContentLoaded', function () {
  const organizations = [
    { id: 1, name: 'Organization 1', adminName: 'John Doe', email: 'johndoe@example.com', gender: 'Male', address: '123 Main St, City, Country', mobile: '0987654321', description: 'Description for Organization 1' },
    { id: 2, name: 'Organization 2', adminName: 'Jane Doe', email: 'janedoe@example.com', gender: 'Female', address: '456 Elm St, City, Country', mobile: '1234567890', description: 'Description for Organization 2' }
  ];

  const organizationListElement = document.getElementById('organizations');
  const detailsBox = document.getElementById('organization-details');
  const detailsContent = document.getElementById('details-content');
  const managedOrganizationsElement = document.getElementById('managed-organizations');
  const closeDetailsButton = document.getElementById('close-details');

  function renderOrganizations() {
    organizationListElement.innerHTML = '';
    organizations.forEach(org => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${org.name}</strong> <p>${org.description}</p>`;
      li.classList.add('organization-item');

      const buttonGroup = document.createElement('div');
      buttonGroup.classList.add('button-group');

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => {
        // Handle edit functionality
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => {
        // Handle delete functionality
      });

      li.addEventListener('click', () => {
        showDetails(org);
      });

      buttonGroup.appendChild(editButton);
      buttonGroup.appendChild(deleteButton);
      li.appendChild(buttonGroup);
      organizationListElement.appendChild(li);
    });
  }

  function showDetails(org) {
    detailsContent.innerHTML = `
      <strong>Name:</strong> ${org.name}<br>
      <strong>Admin Name:</strong> ${org.adminName}<br>
      <strong>Admin Email:</strong> ${org.email}<br>
      <strong>Gender:</strong> ${org.gender}<br>
      <strong>Address:</strong> ${org.address}<br>
      <strong>Mobile:</strong> ${org.mobile}<br>
      <strong>Description:</strong> ${org.description}
    `;

    managedOrganizationsElement.innerHTML = ''; // Clear previous organizations

    // Dummy data for organizations managed by this admin
    const managedOrgs = ['Sub Organization 1', 'Sub Organization 2'];
    managedOrgs.forEach(name => {
      const li = document.createElement('li');
      li.textContent = name;
      managedOrganizationsElement.appendChild(li);
    });

    detailsBox.style.display = 'flex';
  }

  closeDetailsButton.addEventListener('click', () => {
    detailsBox.style.display = 'none';
  });

  renderOrganizations();
});
