document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (!user || authError) {
        // Not logged in - redirect to login with return URL
        window.location.href = '/login?redirect=/account';
        return;
    }

    // User is logged in - load their data
    loadAccountData(user);
});

async function loadAccountData(user) {
    // Load profile info
    document.getElementById('user-name').textContent = user.user_metadata.full_name || 'Not provided';
    document.getElementById('user-email').textContent = user.email;

    // Load order history
    await loadOrders(user.id);
}

async function loadOrders(userId) {
    const ordersContainer = document.getElementById('orders-container');

    try {
        // Fetch orders for this user
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Clear loading state
        ordersContainer.innerHTML = '';

        if (orders.length === 0) {
            // No orders yet
            ordersContainer.innerHTML = `
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    <h3>No orders yet</h3>
                    <p>When you make a purchase, it will appear here</p>
                    <a href="/products" class="btn btn-primary">Browse Products</a>
                </div>
            `;
            return;
        }

        // Display orders
        const ordersHTML = orders.map(order => `
            <div class="order-item">
                <div class="order-image">
                    ${order.product_image ? 
                        `<img src="${order.product_image}" alt="${order.product_name}">` : 
                        `<div class="order-image-placeholder">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <path d="M21 15l-5-5L5 21"/>
                            </svg>
                        </div>`
                    }
                </div>
                <div class="order-details">
                    <h3>${order.product_name}</h3>
                    <div class="order-meta">
                        <span class="order-date">${formatDate(order.created_at)}</span>
                        <span class="order-status status-${order.status}">${order.status}</span>
                    </div>
                </div>
                <div class="order-price">
                    $${parseFloat(order.total_price).toFixed(2)}
                </div>
            </div>
        `).join('');

        ordersContainer.innerHTML = ordersHTML;

    } catch (error) {
        console.error('Error loading orders:', error);
        ordersContainer.innerHTML = `
            <div class="error-state">
                <p>Unable to load orders. Please try again later.</p>
            </div>
        `;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
