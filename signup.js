document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const signupBtn = document.getElementById('signup-btn');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    // Pre-fill email if passed from success page
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
        document.getElementById('email').value = emailParam;
    }

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Validate password length
        if (password.length < 8) {
            errorMessage.textContent = 'Password must be at least 8 characters';
            errorMessage.style.display = 'block';
            return;
        }

        // Disable button and show loading
        signupBtn.disabled = true;
        signupBtn.textContent = 'Creating account...';
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        try {
            // Create account
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: name
                    },
                    emailRedirectTo: `${window.location.origin}/login`
                }
            });

            if (error) throw error;

            // Show success message
            successMessage.innerHTML = `
                <strong>Account created!</strong><br>
                Please check your email (${email}) and click the confirmation link to activate your account.
            `;
            successMessage.style.display = 'block';
            
            // Clear form
            signupForm.reset();
            signupBtn.textContent = 'Account Created ✓';

            // Redirect to login after 5 seconds
            setTimeout(() => {
                window.location.href = '/login';
            }, 5000);

        } catch (error) {
            // Show error message
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
            signupBtn.disabled = false;
            signupBtn.textContent = 'Create Account';
        }
    });
});
