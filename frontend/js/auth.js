// Authentication Management
class AuthManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Show/hide forms
        document.getElementById('showRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        document.getElementById('showLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        // Form submissions
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.logout();
        });
    }

    showLoginForm() {
        document.getElementById('login-form').classList.add('active');
        document.getElementById('register-form').classList.remove('active');
    }

    showRegisterForm() {
        document.getElementById('login-form').classList.remove('active');
        document.getElementById('register-form').classList.add('active');
    }

    async handleLogin() {
        const phoneOrEmail = document.getElementById('loginPhone').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await api.login({ phoneOrEmail, password });
            this.setCurrentUser(response);
            this.showMainApp();
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    }

    async handleRegister() {
        const userData = {
            name: document.getElementById('regName').value,
            phone: document.getElementById('regPhone').value,
            email: document.getElementById('regEmail').value || null,
            password: document.getElementById('regPassword').value,
            role: document.getElementById('regRole').value
        };

        try {
            const response = await api.register(userData);
            this.setCurrentUser(response);
            this.showMainApp();
        } catch (error) {
            alert('Registration failed: ' + error.message);
        }
    }

    setCurrentUser(userData) {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userId', userData.userId);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userRole', userData.role);
        this.currentUser = userData;
    }

    getCurrentUser() {
        const token = localStorage.getItem('token');
        if (!token) return null;

        return {
            token,
            userId: localStorage.getItem('userId'),
            name: localStorage.getItem('userName'),
            role: localStorage.getItem('userRole')
        };
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        this.currentUser = null;
        this.showAuth();
    }

    showAuth() {
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
    }

    showMainApp() {
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
            // Initialize app based on user role
            if (window.app) {
                window.app.init();
            }
        }
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }
}

const authManager = new AuthManager();



