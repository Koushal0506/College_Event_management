const API_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadDashboardData();

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
});

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
        window.location.href = 'login.html';
        return;
    }

    // Simple logic to show name
    document.getElementById('userName').textContent = user.name || user.username;
}

async function loadDashboardData() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user.roles.includes('STUDENT')) {
        loadStudentData(user);
    } else if (user.roles.includes('COLLEGE')) {
        loadCollegeData(user);
    } else if (user.roles.includes('ADMIN')) {
        loadAdminData(user);
    }
}

// Global variable to store events for modal access
let allEvents = [];

async function loadStudentData(user) {
    try {
        // 1. Fetch All Events
        const eventsRes = await fetch(`${API_URL}/events`, {
            headers: { 'Authorization': 'Bearer ' + user.token }
        });
        const events = await eventsRes.json();

        // Store in global variable
        allEvents = events;

        const countEl = document.getElementById('totalEventsCount');
        if (countEl) countEl.textContent = events.length;
        renderEventsGrid(events);

        // 2. Fetch My Registrations
        const regRes = await fetch(`${API_URL}/events/my-registrations`, {
            headers: { 'Authorization': 'Bearer ' + user.token }
        });
        const registrations = await regRes.json();

        const myRegCount = document.getElementById('myRegistrationsCount');
        if (myRegCount) myRegCount.textContent = registrations.length;
        renderRegistrationsTable(registrations, events);
    } catch (e) {
        console.error("Error loading data", e);
    }
}

// ... (renderEventsGrid, renderRegistrationsTable same as before) ...

async function loadCollegeData(user) {
    // 1. Setup Form Listener
    const form = document.getElementById('createEventForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                title: document.getElementById('eventTitle').value,
                category: document.getElementById('eventCategory').value,
                description: document.getElementById('eventDescription').value,
                eventDate: document.getElementById('eventDate').value,
                venue: document.getElementById('eventVenue').value,
                maxParticipants: document.getElementById('eventMax').value
            };

            try {
                const res = await fetch(`${API_URL}/events`, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + user.token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    alert('Event Created!');
                    form.reset();
                    loadMyEvents(user);
                } else {
                    alert('Failed to create event');
                }
            } catch (err) {
                console.error(err);
            }
        });
    }

    loadMyEvents(user);
}

async function loadMyEvents(user) {
    try {
        const res = await fetch(`${API_URL}/events/my`, {
            headers: { 'Authorization': 'Bearer ' + user.token }
        });
        const events = await res.json();
        const tbody = document.getElementById('myEventsTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        events.forEach(event => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-white/5 transition-colors';
            tr.innerHTML = `
                <td class="px-6 py-4 font-medium text-white">${event.title}</td>
                <td class="px-6 py-4 text-gray-400">${new Date(event.eventDate).toLocaleDateString()}</td>
                <td class="px-6 py-4 text-gray-400">${event.category}</td>
                <td class="px-6 py-4">
                     <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        ${event.status}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <button onclick="deleteEvent('${event.id}')" class="text-red-400 hover:text-red-300 text-sm">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error(e);
    }
}

async function deleteEvent(id) {
    if (!confirm('Delete this event?')) return;
    const user = JSON.parse(localStorage.getItem('user'));

    try {
        const res = await fetch(`${API_URL}/events/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + user.token }
        });
        if (res.ok) {
            loadMyEvents(user);
        } else {
            alert('Failed to delete');
        }
    } catch (e) {
        console.error(e);
    }
}


function renderEventsGrid(events) {
    const grid = document.getElementById('dashboardEventsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (events.length === 0) {
        grid.innerHTML = '<div class="col-span-3 text-center py-10 text-gray-500">No events found matching criteria.</div>';
        return;
    }

    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'glass-card rounded-2xl overflow-hidden flex flex-col group';
        card.innerHTML = `
            <div class="h-40 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                 <div class="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all"></div>
                 <div class="absolute top-4 right-4 bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs border border-cyan-500/20">
                    ${event.category || 'Event'}
                </div>
            </div>
            <div class="p-6 flex-1 flex flex-col">
                <div class="text-xs text-blue-400 mb-2 font-semibold uppercase">${event.collegeName || 'College Event'}</div>
                <h3 class="text-xl font-bold text-white mb-2 line-clamp-1">${event.title}</h3>
                 <p class="text-gray-400 text-sm mb-4 line-clamp-2">${event.description || 'No description provided.'}</p>
                <div class="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                    <span class="text-sm text-gray-400">${new Date(event.eventDate).toLocaleDateString()}</span>
                    <button onclick="openModal('${event.id}')" class="text-cyan-400 hover:text-white font-medium text-sm transition-colors border border-cyan-500/30 hover:bg-cyan-600 px-4 py-1.5 rounded-lg">View & Register</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Modal Functions
function openModal(eventId) {
    const event = allEvents.find(e => e.id === eventId);
    if (!event) return;

    document.getElementById('modalTitle').textContent = event.title;
    document.getElementById('modalCollege').textContent = event.collegeName || 'Unknown College';
    document.getElementById('modalDesc').textContent = event.description;
    document.getElementById('modalDate').textContent = new Date(event.eventDate).toLocaleDateString();
    document.getElementById('modalVenue').textContent = event.venue || 'TBA';
    document.getElementById('modalCategory').textContent = event.category;
    document.getElementById('modalSeats').textContent = event.maxParticipants || 'Unlimited';

    const btn = document.getElementById('modalRegisterBtn');
    btn.onclick = () => {
        registerForEvent(eventId);
        closeModal();
    };

    document.getElementById('eventModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('eventModal').classList.add('hidden');
}

function renderRegistrationsTable(registrations, events) {
    const tbody = document.getElementById('registrationsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    registrations.forEach(reg => {
        // Find corresponding event details if possible (simplistic, assumes we have full list)
        const event = events.find(e => e.id === reg.eventId) || { title: 'Unknown Event', collegeName: 'Unknown' };

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-white/5 transition-colors';
        tr.innerHTML = `
            <td class="px-6 py-4 font-medium text-white">${event.title}</td>
            <td class="px-6 py-4 text-gray-400">${event.collegeName || 'Unknown'}</td>
            <td class="px-6 py-4 text-gray-400">${new Date(reg.registrationDate).toLocaleDateString()}</td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ${reg.status}
                </span>
            </td>
            <td class="px-6 py-4">
                <button class="text-cyan-400 hover:text-cyan-300 text-sm">Download Pass</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function registerForEvent(eventId) {
    if (!confirm("Start registration for this event?")) return;

    const user = JSON.parse(localStorage.getItem('user'));
    try {
        const res = await fetch(`${API_URL}/events/${eventId}/register`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + user.token,
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            alert('Registered Successfully!');
            loadDashboardData(); // Reload
        } else {
            const txt = await res.text();
            alert('Failed: ' + txt);
        }
    } catch (e) {
        console.error(e);
        alert('Error registering');
    }
}
