/* =====================================================
   Customer Management System — script.js
   Teknologi: Vanilla JavaScript + LocalStorage
   ===================================================== */

'use strict';

// ─── CONSTANTS & STATE ────────────────────────────────────────────────────────
const STORAGE_KEY = 'cms_customers';
const TODAY = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

let customers = [];
let deleteTargetId = null;
let notifTimer = null;

// ─── DUMMY DATA ───────────────────────────────────────────────────────────────
const DUMMY_CUSTOMERS = [
  {
    id: 'CST-0001',
    name: 'Andi Pratama',
    phone: '081234567890',
    email: 'andi.pratama@gmail.com',
    address: 'Jl. Merdeka No. 12, Jakarta Pusat',
    createdAt: '2026-10-25'
  },
  {
    id: 'CST-0002',
    name: 'Siti Rahayu',
    phone: '082345678901',
    email: 'siti.rahayu@yahoo.com',
    address: 'Jl. Sudirman Blok C No. 5, Bandung',
    createdAt: '2026-10-26'
  },
  {
    id: 'CST-0003',
    name: 'Budi Santoso',
    phone: '083456789012',
    email: 'budi.santoso@outlook.com',
    address: 'Perumahan Griya Indah No. 8, Surabaya',
    createdAt: '2026-10-27'
  },
  {
    id: 'CST-0004',
    name: 'Dewi Anggraeni',
    phone: '084567890123',
    email: 'dewi.anggraeni@gmail.com',
    address: 'Jl. Gatot Subroto No. 33, Semarang',
    createdAt: '2026-10-28'
  },
  {
    id: 'CST-0005',
    name: 'Rizky Firmansyah',
    phone: '085678901234',
    email: 'rizky.firmansyah@mail.com',
    address: 'Jl. Ahmad Yani No. 77, Yogyakarta',
    createdAt: '2026-10-29'
  }
];

// ─── ID GENERATOR ─────────────────────────────────────────────────────────────
function generateId() {
  const existing = customers.map(c => {
    const n = parseInt(c.id.replace('CST-', ''), 10);
    return isNaN(n) ? 0 : n;
  });
  const next = existing.length > 0 ? Math.max(...existing) + 1 : 1;
  return 'CST-' + String(next).padStart(4, '0');
}

// ─── STORAGE ──────────────────────────────────────────────────────────────────
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    customers = raw ? JSON.parse(raw) : [];
  } catch (e) {
    customers = [];
  }
  if (customers.length === 0) {
    customers = DUMMY_CUSTOMERS.map(c => ({ ...c }));
    saveToStorage();
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

// ─── NOTIFICATION ─────────────────────────────────────────────────────────────
function showNotification(message, type = 'success') {
  const el = document.getElementById('notification');
  el.className = 'notification ' + type + ' show';
  el.innerHTML = `<div class="notification-inner">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      ${type === 'success'
        ? '<polyline points="20 6 9 17 4 12"/>'
        : type === 'error'
        ? '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
        : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
    </svg>
    <span>${message}</span>
  </div>`;
  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => {
    el.className = 'notification';
  }, 3200);
}

// ─── RENDER DASHBOARD ─────────────────────────────────────────────────────────
function renderDashboard() {
  const total = customers.length;
  const newToday = customers.filter(c => c.createdAt === TODAY).length;

  document.getElementById('totalCustomers').textContent = total;
  document.getElementById('newCustomers').textContent = newToday;

  const recent = [...customers].reverse().slice(0, 5);
  const tbody = document.getElementById('recentTableBody');
  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:30px">Belum ada data pelanggan.</td></tr>`;
    return;
  }
  tbody.innerHTML = recent.map(c => `
    <tr>
      <td><span class="id-badge">${escHtml(c.id)}</span></td>
      <td class="td-name">${escHtml(c.name)}</td>
      <td>${escHtml(c.phone)}</td>
      <td class="td-email">${escHtml(c.email)}</td>
      <td class="td-address" title="${escHtml(c.address)}">${escHtml(c.address)}</td>
    </tr>
  `).join('');
}

// ─── RENDER CUSTOMERS TABLE ───────────────────────────────────────────────────
function renderCustomers(list) {
  const tbody = document.getElementById('customerTableBody');
  const empty = document.getElementById('emptyState');

  if (!list || list.length === 0) {
    tbody.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  tbody.innerHTML = list.map(c => `
    <tr data-id="${escHtml(c.id)}">
      <td><span class="id-badge">${escHtml(c.id)}</span></td>
      <td class="td-name">${escHtml(c.name)}</td>
      <td>${escHtml(c.phone)}</td>
      <td class="td-email">${escHtml(c.email)}</td>
      <td class="td-address" title="${escHtml(c.address)}">${escHtml(c.address)}</td>
      <td>
        <div class="action-btns">
          <button class="btn-edit" data-id="${escHtml(c.id)}">Edit</button>
          <button class="btn-delete" data-id="${escHtml(c.id)}">Hapus</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ─── SEARCH ───────────────────────────────────────────────────────────────────
function handleSearch() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const filtered = q
    ? customers.filter(c => c.name.toLowerCase().includes(q))
    : customers;
  renderCustomers(filtered);
}

// ─── MODAL FORM ───────────────────────────────────────────────────────────────
function openModal(mode, id = null) {
  const backdrop = document.getElementById('modalBackdrop');
  const title = document.getElementById('modalTitle');
  const submitBtn = document.getElementById('submitBtn');

  clearFormErrors();

  if (mode === 'add') {
    title.textContent = 'Tambah Pelanggan';
    submitBtn.textContent = 'Simpan';
    document.getElementById('customerForm').reset();
    document.getElementById('customerId').value = '';
  } else if (mode === 'edit' && id) {
    const c = customers.find(x => x.id === id);
    if (!c) return;
    title.textContent = 'Edit Pelanggan';
    submitBtn.textContent = 'Perbarui';
    document.getElementById('customerId').value = c.id;
    document.getElementById('inputName').value = c.name;
    document.getElementById('inputPhone').value = c.phone;
    document.getElementById('inputEmail').value = c.email;
    document.getElementById('inputAddress').value = c.address;
  }

  backdrop.classList.remove('hidden');
  document.getElementById('inputName').focus();
}

function closeModal() {
  document.getElementById('modalBackdrop').classList.add('hidden');
  clearFormErrors();
}

// ─── FORM VALIDATION ──────────────────────────────────────────────────────────
function clearFormErrors() {
  ['Name', 'Phone', 'Email', 'Address'].forEach(f => {
    document.getElementById('error' + f).textContent = '';
    const input = document.getElementById('input' + f);
    if (input) input.classList.remove('invalid');
  });
}

function setFieldError(field, msg) {
  document.getElementById('error' + field).textContent = msg;
  const input = document.getElementById('input' + field);
  if (input) input.classList.add('invalid');
}

function validateForm(name, phone, email, address) {
  let valid = true;
  clearFormErrors();

  if (!name.trim()) { setFieldError('Name', 'Nama tidak boleh kosong.'); valid = false; }
  if (!phone.trim()) { setFieldError('Phone', 'Nomor telepon tidak boleh kosong.'); valid = false; }
  else if (!/^[0-9+\-\s]{7,20}$/.test(phone.trim())) { setFieldError('Phone', 'Format nomor telepon tidak valid.'); valid = false; }

  if (!email.trim()) { setFieldError('Email', 'Email tidak boleh kosong.'); valid = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setFieldError('Email', 'Format email tidak valid.'); valid = false; }

  if (!address.trim()) { setFieldError('Address', 'Alamat tidak boleh kosong.'); valid = false; }

  return valid;
}

// ─── SAVE CUSTOMER (ADD / EDIT) ───────────────────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('customerId').value;
  const name = document.getElementById('inputName').value;
  const phone = document.getElementById('inputPhone').value;
  const email = document.getElementById('inputEmail').value;
  const address = document.getElementById('inputAddress').value;

  if (!validateForm(name, phone, email, address)) return;

  if (id) {
    // Edit mode
    const idx = customers.findIndex(c => c.id === id);
    if (idx === -1) return;
    customers[idx] = { ...customers[idx], name: name.trim(), phone: phone.trim(), email: email.trim(), address: address.trim() };
    saveToStorage();
    renderCustomers(getFilteredList());
    renderDashboard();
    closeModal();
    showNotification('Data pelanggan berhasil diperbarui.', 'success');
  } else {
    // Add mode
    const newCustomer = {
      id: generateId(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      createdAt: TODAY
    };
    customers.push(newCustomer);
    saveToStorage();
    renderCustomers(getFilteredList());
    renderDashboard();
    closeModal();
    showNotification('Pelanggan baru berhasil ditambahkan.', 'success');
  }
}

// ─── DELETE CUSTOMER ──────────────────────────────────────────────────────────
function openConfirmDelete(id) {
  const c = customers.find(x => x.id === id);
  if (!c) return;
  deleteTargetId = id;
  document.getElementById('confirmMsg').textContent =
    `Apakah Anda yakin ingin menghapus pelanggan "${c.name}"? Tindakan ini tidak dapat dibatalkan.`;
  document.getElementById('confirmBackdrop').classList.remove('hidden');
}

function closeConfirmModal() {
  document.getElementById('confirmBackdrop').classList.add('hidden');
  deleteTargetId = null;
}

function handleConfirmDelete() {
  if (!deleteTargetId) return;
  customers = customers.filter(c => c.id !== deleteTargetId);
  saveToStorage();
  renderCustomers(getFilteredList());
  renderDashboard();
  closeConfirmModal();
  showNotification('Data pelanggan berhasil dihapus.', 'info');
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getFilteredList() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  return q ? customers.filter(c => c.name.toLowerCase().includes(q)) : customers;
}

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
function switchSection(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById('section-' + section).classList.remove('hidden');
  document.querySelector(`.nav-item[data-section="${section}"]`).classList.add('active');

  const titles = { dashboard: 'Dashboard', customers: 'Data Pelanggan' };
  document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';

  if (section === 'customers') {
    renderCustomers(customers);
  } else if (section === 'dashboard') {
    renderDashboard();
  }

  closeSidebarMobile();
}

// ─── SIDEBAR MOBILE ───────────────────────────────────────────────────────────
function openSidebarMobile() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('overlay').classList.add('active');
}

function closeSidebarMobile() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
}

// ─── EVENT DELEGATION (table actions) ─────────────────────────────────────────
function handleTableClick(e) {
  const editBtn = e.target.closest('.btn-edit');
  const deleteBtn = e.target.closest('.btn-delete');
  if (editBtn) {
    openModal('edit', editBtn.dataset.id);
  } else if (deleteBtn) {
    openConfirmDelete(deleteBtn.dataset.id);
  }
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
function init() {
  loadFromStorage();
  renderDashboard();

  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      switchSection(item.dataset.section);
    });
  });

  // Sidebar mobile
  document.getElementById('menuBtn').addEventListener('click', openSidebarMobile);
  document.getElementById('sidebarClose').addEventListener('click', closeSidebarMobile);
  document.getElementById('overlay').addEventListener('click', closeSidebarMobile);

  // Add buttons
  document.getElementById('addCustomerBtn').addEventListener('click', () => openModal('add'));
  document.getElementById('dashboardAddBtn').addEventListener('click', () => {
    switchSection('customers');
    openModal('add');
  });

  // Form submit
  document.getElementById('customerForm').addEventListener('submit', handleFormSubmit);

  // Modal close
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('cancelBtn').addEventListener('click', closeModal);

  // Close modal on backdrop click
  document.getElementById('modalBackdrop').addEventListener('click', e => {
    if (e.target === document.getElementById('modalBackdrop')) closeModal();
  });

  // Confirm delete
  document.getElementById('confirmClose').addEventListener('click', closeConfirmModal);
  document.getElementById('confirmCancelBtn').addEventListener('click', closeConfirmModal);
  document.getElementById('confirmDeleteBtn').addEventListener('click', handleConfirmDelete);
  document.getElementById('confirmBackdrop').addEventListener('click', e => {
    if (e.target === document.getElementById('confirmBackdrop')) closeConfirmModal();
  });

  // Table action delegation
  document.getElementById('customerTableBody').addEventListener('click', handleTableClick);

  // Search
  document.getElementById('searchInput').addEventListener('input', handleSearch);
  document.getElementById('clearSearch').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    renderCustomers(customers);
  });

  // Keyboard: Escape closes modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      closeConfirmModal();
    }
  });

  // Remove invalid class on input
  ['inputName', 'inputPhone', 'inputEmail', 'inputAddress'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('invalid');
        const fieldMap = { inputName: 'Name', inputPhone: 'Phone', inputEmail: 'Email', inputAddress: 'Address' };
        const errEl = document.getElementById('error' + fieldMap[id]);
        if (errEl) errEl.textContent = '';
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
