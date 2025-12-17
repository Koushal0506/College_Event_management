const API_URL = '/api/admin';
const user = JSON.parse(localStorage.getItem('user'));

document.addEventListener('DOMContentLoaded', () => {
    loadPendingColleges();
});

async function loadPendingColleges() {
    try {
        const res = await fetch(`${API_URL}/pending-colleges`, {
            headers: { 'Authorization': 'Bearer ' + user.token }
        });

        if (!res.ok) throw new Error('Failed to fetch');

        const colleges = await res.json();
        const tbody = document.getElementById('pendingTableBody');
        const emptyState = document.getElementById('emptyState');

        tbody.innerHTML = '';

        if (colleges.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        } else {
            emptyState.classList.add('hidden');
        }

        colleges.forEach(college => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-white/5 transition-colors';
            tr.innerHTML = `
                <td class="px-6 py-4 font-medium text-white">${college.collegeName || college.name}</td>
                <td class="px-6 py-4 text-gray-400">${college.location || '-'}</td>
                <td class="px-6 py-4 text-gray-400">${college.contactEmail || college.email}</td>
                <td class="px-6 py-4 text-right space-x-2">
                    <button onclick="approve('${college.id}')" class="px-3 py-1 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20 text-sm">Approve</button>
                    <button onclick="reject('${college.id}')" class="px-3 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 text-sm">Reject</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (e) {
        console.error(e);
        // alert('Error loading data');
    }
}

async function approve(id) {
    if (!confirm('Approve this college?')) return;
    try {
        const res = await fetch(`${API_URL}/approve/${id}`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + user.token }
        });
        if (res.ok) {
            loadPendingColleges();
        } else {
            alert('Failed to approve');
        }
    } catch (e) { console.error(e); }
}

async function reject(id) {
    if (!confirm('Reject (Delete) this college account?')) return;
    try {
        const res = await fetch(`${API_URL}/reject/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + user.token }
        });
        if (res.ok) {
            loadPendingColleges();
        } else {
            alert('Failed to reject');
        }
    } catch (e) { console.error(e); }
}
