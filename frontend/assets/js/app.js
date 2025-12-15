// Main App Logic

document.addEventListener('DOMContentLoaded', () => {
    // Simulated Event Data (For initial display before backend is ready)
    const featuredEvents = [
        {
            title: "TechNova 2025",
            college: "MIT Institute",
            date: "Dec 20, 2025",
            category: "Technical",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2670"
        },
        {
            title: "Cultural Fiesta",
            college: "Stanford Arts",
            date: "Jan 15, 2026",
            category: "Cultural",
            image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2670"
        },
        {
            title: "RoboWar Championship",
            college: "IIT Tech Park",
            date: "Feb 02, 2026",
            category: "Technical",
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=2670"
        }
    ];

    const eventGrid = document.getElementById('events-grid');

    if (eventGrid) {
        featuredEvents.forEach(event => {
            const card = document.createElement('div');
            card.className = 'glass-card rounded-2xl overflow-hidden transition-all duration-300 group';
            card.innerHTML = `
                <div class="card-image-container h-48 relative">
                    <img src="${event.image}" alt="${event.title}" class="card-image w-full h-full object-cover">
                    <div class="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10">
                        ${event.category}
                    </div>
                </div>
                <div class="p-6">
                    <div class="text-xs text-cyan-400 mb-2 font-semibold uppercase tracking-wider">${event.college}</div>
                    <h3 class="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">${event.title}</h3>
                    <div class="flex items-center text-gray-400 text-sm mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        ${event.date}
                    </div>
                    <button class="w-full bg-white/10 hover:bg-cyan-500 hover:text-white text-white py-2 rounded-lg font-medium transition-all duration-300 border border-white/10 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/25">
                        View Details
                    </button>
                </div>
            `;
            eventGrid.appendChild(card);
        });
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

    document.querySelectorAll('.glass-card').forEach(el => observer.observe(el));
});
