// Main App Logic

document.addEventListener('DOMContentLoaded', () => {
    // Simulated Event Data (For initial display before backend is ready)
    const eventGrid = document.getElementById('events-grid');
    const API_URL = '/api/events';

    if (eventGrid) {
        fetchEvents();
    }

    async function fetchEvents() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch events');

            const events = await response.json();

            if (events.length === 0) {
                eventGrid.innerHTML = '<div class="col-span-3 text-center text-gray-400 py-10">No upcoming events found. Check back later!</div>';
                return;
            }

            // Sort by date (nearest first) - optional
            // events.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

            // Limit to first 6 for home page? Or show all? Let's show up to 6.
            const displayEvents = events.slice(0, 6);

            eventGrid.innerHTML = ''; // Clear loading/placeholder

            displayEvents.forEach(event => {
                // Formatting Date
                const dateObj = new Date(event.eventDate);
                const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                const card = document.createElement('div');
                card.className = 'glass-card rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col h-full';
                // Using a default gradient if no image provided (backend doesn't store images yet in this version)
                // If we added image URL to Event model, we used it here.
                const imageSection = `
                <div class="h-48 bg-gradient-to-br from-gray-700 to-gray-900 relative overflow-hidden flex items-center justify-center">
                    <span class="text-4xl">🎉</span>
                    <div class="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10">
                        ${event.category || 'General'}
                    </div>
                </div>`;

                card.innerHTML = `
                    ${imageSection}
                    <div class="p-6 flex-1 flex flex-col">
                        <div class="text-xs text-cyan-400 mb-2 font-semibold uppercase tracking-wider">${event.collegeName || 'College Event'}</div>
                        <h3 class="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">${event.title}</h3>
                        <div class="flex items-center text-gray-400 text-sm mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            ${dateStr}
                        </div>
                        <p class="text-gray-400 text-sm mb-4 line-clamp-2">${event.description || ''}</p>
                        <div class="mt-auto">
                            <a href="login.html" class="block w-full text-center bg-white/10 hover:bg-cyan-500 hover:text-white text-white py-2 rounded-lg font-medium transition-all duration-300 border border-white/10 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/25">
                                View & Register
                            </a>
                        </div>
                    </div>
                `;
                eventGrid.appendChild(card);
                // Trigger animation observer if it exists
                if (window.observer) window.observer.observe(card);
            });

            // Re-attach observer to new elements
            document.querySelectorAll('.glass-card').forEach(el => {
                if (typeof observer !== 'undefined') observer.observe(el);
            });

        } catch (error) {
            console.error('Error fetching events:', error);
            eventGrid.innerHTML = '<div class="col-span-3 text-center text-red-400 py-10">Failed to load events. Is backend running?</div>';
        }
    }

    // Scroll Animation Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    document.querySelectorAll('.glass-card').forEach(el => observer.observe(el));
});
