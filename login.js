document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Disable button and show loading
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';
        errorMessage.style.display = 'none';

        try {
            // Attempt login
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            // Check if email is confirmed
            if (data.user && !data.user.email_confirmed_at) {
                throw new Error('Please confirm your email before logging in. Check your inbox.');
            }

            // Success - redirect to account or return URL
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect') || '/account';
            window.location.href = redirect;

        } catch (error) {
            // Show error message
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
            loginBtn.disabled = false;
            loginBtn.textContent = 'Log In';
        }
    });
});
