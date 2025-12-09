// Supabase Configuration
const SUPABASE_URL = 'https://xfswosnhewblxdtvtbcz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhmc3dvc25oZXdibHhkdHZ0YmN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNDg5NjEsImV4cCI6MjA4MDcyNDk2MX0.xghqZwlpxQ6Gu0nz98wVUOOtz-Hqiw5NPNJ0mAE9TLc';

// Stripe Configuration
const STRIPE_PUBLIC_KEY = 'pk_live_51SaqPKL1Zz9xnRn7G1aXYaSm3oBmhoweyi9YTLlBGzdSzcpmVh1Ldla4rWWPLaNJqtbTOTILTzCSA4iBK6j6s4dx00SRABq1lW';

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Initialize Stripe
const stripe = typeof Stripe !== 'undefined' ? Stripe(STRIPE_PUBLIC_KEY) : null;

// Initialize auth state on every page (navbar)
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Find nav-links container
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    
    if (user) {
        // User is logged in - show account dropdown
        const accountLink = document.createElement('div');
        accountLink.className = 'account-dropdown';
        accountLink.innerHTML = `
            <button class="account-btn">
                <span>${user.email.split('@')[0]}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M2 4l4 4 4-4"/>
                </svg>
            </button>
            <div class="account-menu">
                <a href="/account">My Account</a>
                <a href="#" id="logout-btn">Logout</a>
            </div>
        `;
        navLinks.appendChild(accountLink);
        
        // Logout handler
        document.getElementById('logout-btn').addEventListener('click', async (e) => {
            e.preventDefault();
            await supabase.auth.signOut();
            window.location.href = '/';
        });
    } else {
        // User is logged out - show login button
        const loginLink = document.createElement('a');
        loginLink.href = '/login';
        loginLink.textContent = 'Login';
        navLinks.appendChild(loginLink);
    }
});
