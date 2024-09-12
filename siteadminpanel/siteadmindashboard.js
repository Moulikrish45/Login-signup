document.addEventListener('DOMContentLoaded', function () {
    const API_GET_PCS = 'https://mdashttptriggersfunctionapp.azurewebsites.net/api/getpcs?';
    const API_CREATE_PC_USER = 'https://mdashttptriggersfunctionapp.azurewebsites.net/api/createpcuser?';
    
    const pcs = [
      // Initial PCs for development/testing purposes
      { id: 1, name: 'PC 1', AliasName: 'Alias PC 1', admin: { name: 'John Doe', email: 'johndoe@example.com', phone: '408-996-1010', managedPCs: ['Sub PC 1', 'Sub PC 2'] } },
      { id: 2, name: 'PC 2', AliasName: 'Alias PC 2', admin: { name: 'Jane Doe', email: 'janedoe@example.com', phone: '408-996-1011', managedPCs: ['Sub PC A', 'Sub PC B'] } }
    ];
  
    const pcListElement = document.getElementById('pcs');
    const fallbackMessage = document.getElementById('fallback-message');
    const pcDetailsContainer = document.getElementById('pc-details');
    const addPcButton = document.getElementById('add-pc-button');
    const pcModal = document.getElementById('pc-modal');
    const closeButton = document.querySelector('.close-button');
    const pcForm = document.getElementById('pc-form');
    const modalOverlay = document.getElementById('modal-overlay');
    const qrScanner = document.getElementById('qr-scanner');
    const closeScannerButton = document.getElementById('close-scanner-button');
    const mainContent = document.querySelector('.container');
    let editingPcId = null; // To track the PC being edited
  
    function renderPCs() {
      if (pcs.length === 0) {
        fallbackMessage.style.display = 'block';
      } else {
        fallbackMessage.style.display = 'none';
        pcListElement.innerHTML = '';
        pcs.forEach(pc => {
          const li = document.createElement('li');
          li.classList.add('pc-item');
          li.innerHTML = `
            <span class="pc-name">${pc.name}</span>
            <span class="pc-description">${pc.AliasName}</span>
            <div class="pc-actions">
              <button class="edit-button">Edit</button>
              <button class="delete-button">Delete</button>
            </div>
          `;
          li.querySelector('.edit-button').addEventListener('click', (e) => {
            e.stopPropagation();
            openEditPCModal(pc);
          });
          li.querySelector('.delete-button').addEventListener('click', (e) => {
            e.stopPropagation();
            deletePC(pc.id);
          });
          li.addEventListener('click', () => showPCDetails(pc.admin));
          pcListElement.appendChild(li);
        });
      }
    }
  
    function showPCDetails(admin) {
      const managedPCs = Array.isArray(admin.managedPCs) ? admin.managedPCs : [];
    
      pcDetailsContainer.innerHTML = `
        <div class="pc-details-header">
          <h3>${admin.name}<br><small>${admin.email}</small></h3>
        </div>
        <div class="pc-details-body">
          <div class="column">
            <label>Phone Number:</label>
            <p>${admin.phone}</p>
          </div>
        </div>
        <h3>Managed PCs:</h3>
        <ul id="managed-pcs">
          ${managedPCs.map(pc => `<li>${pc}</li>`).join('')}
        </ul>
      `;
      pcDetailsContainer.style.display = 'block';
    }
  
    function openEditPCModal(pc) {
      editingPcId = pc.id;
      document.getElementById('modal-title').textContent = 'Edit PC';
      pcForm['pc-name'].value = pc.name;
      pcForm['pc-admin-name'].value = pc.admin.name;
      pcForm['pc-admin-email'].value = pc.admin.email;
      pcForm['pc-admin-password'].value = ''; // Leave empty for security reasons
      pcForm['pc-admin-repeat-password'].value = ''; // Leave empty for security reasons
      const gender = pc.admin.gender ? pc.admin.gender.toLowerCase() : 'other';
      pcForm['pc-admin-gender'].value = gender;
      pcForm['pc-admin-address'].value = pc.admin.address || ''; // Default to empty string if not defined
      pcForm['pc-admin-mobile'].value = pc.admin.phone || ''; // Default to empty string if not defined
  
      // Show overlay and blur background
      if (modalOverlay) {
        modalOverlay.classList.add('modal-show');
      }
      if (pcModal) {
        pcModal.style.display = 'block';
      } else {
        console.error('pcModal is not found.');
      }
      if (mainContent) {
        mainContent.classList.add('blur-background');
      }
    }
  
    function openAddPCModal() {
      editingPcId = null;
      document.getElementById('modal-title').textContent = 'Add PC';
      pcForm.reset();
      if (modalOverlay) {
        modalOverlay.classList.add('modal-show');
      }
      if (pcModal) {
        pcModal.style.display = 'block';
      } else {
        console.error('pcModal is not found.');
      }
      if (mainContent) {
        mainContent.classList.add('blur-background');
      }
    }
    
    function closeModal() {
      if (modalOverlay) {
        modalOverlay.classList.remove('modal-show'); // Hide the overlay
      }
      if (pcModal) {
        pcModal.style.display = 'none'; // Hide the modal
      }
      if (mainContent) {
        mainContent.classList.remove('blur-background'); // Remove the blur effect
      }
      qrScanner.style.display = 'none'; // Hide QR scanner if visible
    }
  
    function deletePC(pcId) {
      const updatedPCs = pcs.filter(pc => pc.id !== pcId);
      
      pcs.length = 0; // Clear the original array
      pcs.push(...updatedPCs); // Push the filtered PCs back
    
      renderPCs();
      pcDetailsContainer.style.display = 'none'; // Hide details if the selected PC is deleted
    }
  
    pcForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const newPC = {
        id: editingPcId || Date.now(),
        name: pcForm['pc-name'].value,
        AliasName: pcForm['pc-admin-name'].value, // Adjusted according to admin's name
        admin: {
          name: pcForm['pc-admin-name'].value,
          email: pcForm['pc-admin-email'].value,
          phone: pcForm['pc-admin-mobile'].value,
          gender: pcForm['pc-admin-gender'].value,
          address: pcForm['pc-admin-address'].value
        }
      };
  
      if (editingPcId) {
        const index = pcs.findIndex(pc => pc.id === editingPcId);
        pcs[index] = newPC;
      } else {
        pcs.push(newPC);
      }
  
      // Hide the form and show QR scanner
      pcModal.querySelector('form').style.display = 'none';
      qrScanner.style.display = 'block';
  
      // Initialize QR scanner here (example code)
      initQRScanner(newPC);
  
      closeModal();
      renderPCs();
    });
  
    addPcButton.addEventListener('click', openAddPCModal);
    closeButton.addEventListener('click', closeModal);
    closeScannerButton.addEventListener('click', () => {
      qrScanner.style.display = 'none'; // Hide QR scanner
      pcModal.querySelector('form').style.display = 'block'; // Show form again
    });
  
    function retrievePCs() {
      const token = getSessionToken();
      if (!token) {
        window.location.href = '/login&signup/login.html'; // Redirect to login if no token
        return;
      }
  
      fetch(API_GET_PCS, {
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
        if (Array.isArray(data.pcs)) {
          pcs.length = 0; // Clear the array
          pcs.push(...data.pcs); // Populate it with new data
          renderPCs();
        } else {
          console.error('Unexpected response format:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching PCs:', error);
      });
    }
  
    retrievePCs(); // Fetch and display PCs on page load
  
    function createPCUser(pc) {
      const token = getSessionToken(); // Retrieve token from cookies
  
      if (!token) {
        console.error('No session token found. Please log in again.');
        return;
      }
  
      fetch(API_CREATE_PC_USER, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pc)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('PC user created successfully:', data);
      })
      .catch(error => {
        console.error('Error creating PC user:', error);
      });
    }
  
    function initQRScanner(pc) {
      // Example QR scanner setup, replace with actual implementation
      const qrScannerContainer = document.getElementById('qr-scanner');
      qrScannerContainer.innerHTML = `
        <video id="preview" style="width: 100%;"></video>
        <p id="qr-result">Scanning...</p>
      `;
  
      const scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
  
      scanner.addListener('scan', function (content) {
        console.log('QR Code scanned:', content);
  
        // Combine the QR code content with the form data
        const combinedData = { ...pc, qrCodeData: content };
  
        // Log the combined data to console
        console.log('Combined Data:', combinedData);
  
        // Send the combined data to API
        createPCUser(combinedData);
  
        // Hide the QR scanner and show the form again
        qrScanner.style.display = 'none';
        pcModal.querySelector('form').style.display = 'block';
      });
  
      Instascan.Camera.getCameras()
        .then(function (cameras) {
          if (cameras.length > 0) {
            scanner.start(cameras[0]);
          } else {
            console.error('No cameras found.');
          }
        })
        .catch(function (e) {
          console.error(e);
        });
    }
  
    function getSessionToken() {
      // Retrieve the token from cookies or any other storage
      const name = 'session_token=';
      const decodedCookie = decodeURIComponent(document.cookie);
      const cookies = decodedCookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
          cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
          return cookie.substring(name.length, cookie.length);
        }
      }
      return null;
    }
  });
    