// src/services/authService.js
// TEMPORARY IN-MEMORY AUTH MOCK
// NOTE: Replace these functions with Supabase API calls later.

const USERS_KEY = 'kai_users_db';
const SESSION_KEY = 'kai_session';

const getUsers = () => {
    try {
        const data = localStorage.getItem(USERS_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const registerUser = async (name, email, password) => {
    // Supabase equivalent: supabase.auth.signUp({ email, password, options: { data: { name } } })
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsers();
            if (users.find(u => u.email === email)) {
                return reject(new Error('Email already registered.'));
            }
            const newUser = { id: Date.now().toString(), name, email, password };
            users.push(newUser);
            saveUsers(users);

            // Optional: Auto-login after registration
            const sessionData = { id: newUser.id, name: newUser.name, email: newUser.email };
            localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
            resolve({ user: sessionData });
        }, 600); // simulate network delay
    });
};

export const loginUser = async (email, password) => {
    // Supabase equivalent: supabase.auth.signInWithPassword({ email, password })
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password);
            if (!user) {
                return reject(new Error('Invalid email or password.'));
            }

            const sessionData = { id: user.id, name: user.name, email: user.email };
            localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
            resolve({ user: sessionData });
        }, 600);
    });
};

export const logoutUser = async () => {
    // Supabase equivalent: supabase.auth.signOut()
    return new Promise((resolve) => {
        setTimeout(() => {
            localStorage.removeItem(SESSION_KEY);
            resolve();
        }, 300);
    });
};

export const getCurrentUser = () => {
    // Supabase equivalent: supabase.auth.getUser() / supabase.auth.getSession()
    try {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    } catch {
        return null;
    }
};
