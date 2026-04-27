import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
    getFirestore, doc, setDoc, getDoc, collection, addDoc,
    query, getDocs, serverTimestamp, where, limit
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAaSCa2dRG55TC8h34ROdld3raUJn0o1zI",
    authDomain: "mini-arcade-v.firebaseapp.com",
    projectId: "mini-arcade-v",
    storageBucket: "mini-arcade-v.firebasestorage.app",
    messagingSenderId: "126236166995",
    appId: "1:126236166995:web:437f6c6f5ea7f915ecafa6",
    measurementId: "G-TWXCQYBW5L"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
const gProvider = new GoogleAuthProvider();

window._fb = { auth, db };
window._currentUser = null;

onAuthStateChanged(auth, user => {
    window._currentUser = user || null;
    const playerNameEl  = document.getElementById('player-name');
    const navUsernameEl = document.getElementById('nav-username');
    const authBtnEl     = document.getElementById('auth-btn');
    const navUserPillEl = document.getElementById('nav-user-pill');

    if (user) {
        const name = (user.displayName || user.email.split('@')[0]).toUpperCase();
        if (playerNameEl)  playerNameEl.textContent  = name;
        if (navUsernameEl) navUsernameEl.textContent = name;
        if (authBtnEl) {
            authBtnEl.innerHTML = `<span class="text-[#00ff9d]">▼</span> LOGOUT`;
            authBtnEl.onclick   = window.fbLogout;
        }
        if (navUserPillEl) {
            navUserPillEl.classList.remove('hidden');
            navUserPillEl.style.display = 'flex';
        }
    } else {
        if (playerNameEl)  playerNameEl.textContent  = 'GUEST';
        if (navUsernameEl) navUsernameEl.textContent = 'GUEST';
        if (authBtnEl) {
            authBtnEl.innerHTML = `<span class="text-[#00ff9d]">▼</span> LOGIN`;
            authBtnEl.onclick   = () => window.showAuthModal('login');
        }
        if (navUserPillEl) {
            navUserPillEl.classList.add('hidden');
            navUserPillEl.style.display = 'none';
        }
    }
});



function friendlyAuthError(e) {
    const code = (e && e.code) || '';
    const map = {
        'auth/invalid-email':         'That email looks invalid dude.',
        'auth/user-not-found':        'No account with that emaiL in my database.',
        'auth/wrong-password':        'Wrong password for this email.',
        'auth/invalid-credential':    'Invalid email or password I couldnt figure it out.',
        'auth/email-already-in-use':  'An account with that email already exists, Try logging in.',
        'auth/weak-password':         'Password must be 6+ characters (Dude make something much longer).',
        'auth/popup-closed-by-user':  'Sign-in popup was closed before finishing so restart progress.',
        'auth/popup-blocked':         'Your browser blocked the popup. Allow popups and try again .',
        'auth/cancelled-popup-request': 'Sign-in cancelled by the user.',
        'auth/network-request-failed': 'Network error. Check your connection.',
        'auth/unauthorized-domain':   'This domain is not authorized in Firebase. Add it under Authentication → Settings → Authorized domains.'
    };
    return map[code] || (e && e.message) || 'Something went wrong.';
}

window.fbRegister = async function() {
    const name  = document.getElementById('auth-name').value.trim();
    const email = document.getElementById('auth-email').value.trim();
    const pass  = document.getElementById('auth-pass').value;
    const err   = document.getElementById('auth-error');
    err.textContent = '';

    if (!name || !email || !pass) { err.textContent = 'Fill in all fields.'; return; }
    if (pass.length < 6) { err.textContent = 'Password must be 6+ characters.'; return; }

    try {
        window.setAuthLoading(true);
        const { user } = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(user, { displayName: name });
        await setDoc(doc(db, 'users', user.uid), {
            displayName: name,
            email: user.email,
            createdAt: serverTimestamp()
        });
        window.hideAuthModal();
    } catch (e) {
        console.error('Register error:', e);
        err.textContent = friendlyAuthError(e);
    } finally { window.setAuthLoading(false); }
};

window.fbLogin = async function() {
    const email = document.getElementById('auth-email').value.trim();
    const pass  = document.getElementById('auth-pass').value;
    const err   = document.getElementById('auth-error');
    err.textContent = '';

    if (!email || !pass) { err.textContent = 'Fill in email and password.'; return; }

    try {
        window.setAuthLoading(true);
        await signInWithEmailAndPassword(auth, email, pass);
        window.hideAuthModal();
    } catch (e) {
        console.error('Login error:', e);
        err.textContent = friendlyAuthError(e);
    } finally { window.setAuthLoading(false); }
};

window.fbGoogleLogin = async function() {
    const err = document.getElementById('auth-error');
    err.textContent = '';
    try {
        window.setAuthLoading(true);
        const result = await signInWithPopup(auth, gProvider);
        const user = result.user;
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (!snap.exists()) {
            await setDoc(doc(db, 'users', user.uid), {
                displayName: user.displayName || user.email.split('@')[0],
                email: user.email,
                createdAt: serverTimestamp()
            });
        }
        window.hideAuthModal();
    } catch (e) {
        console.error('Google login error:', e);
        err.textContent = friendlyAuthError(e);
    } finally { window.setAuthLoading(false); }
};

window.fbLogout = async function() {
    try { await signOut(auth); }
    catch (e) { console.error('Logout error:', e); }
};
const GAMES = ['memory', 'tictactoe', 'reaction', 'quiz', 'snake', 'scramble', 'numguess', 'hangman'];

window.fbSaveScore = async function(game, score) {
    const user = auth.currentUser;
    if (!user) {
        window.showAuthModal('login');
        alert('Please log in to save your score to the leaderboard!');
        return false;
    }
    try {
        await addDoc(collection(db, 'scores'), {
            uid:         user.uid,
            displayName: user.displayName || user.email.split('@')[0],
            game:        game,
            score:       Number(score) || 0,
            createdAt:   serverTimestamp()
        });
        return true;
    } catch (e) {
        console.error('Save score error:', e);
        alert('Could not save score: ' + (e.message || e.code));
        return false;
    }
};

async function fetchTopScoresForGame(game, opts = {}) {
    try {
        const filters = [where('game', '==', game)];
        if (opts.uid) filters.push(where('uid', '==', opts.uid));
        const q = query(collection(db, 'scores'), ...filters, limit(200));
        const snap = await getDocs(q);
        let rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        if (!opts.uid) {
            const bestByUser = new Map();
            for (const r of rows) {
                const prev = bestByUser.get(r.uid);
                if (!prev || (r.score || 0) > (prev.score || 0)) bestByUser.set(r.uid, r);
            }
            rows = Array.from(bestByUser.values());
        }

        rows.sort((a, b) => (b.score || 0) - (a.score || 0));
        return rows.slice(0, opts.uid ? 5 : 10);
    } catch (e) {
        console.error(`Leaderboard fetch failed for ${game}:`, e);
        return [];
    }
}

window.fbLoadLeaderboard = async function() {
    const result = {};
    await Promise.all(GAMES.map(async g => { result[g] = await fetchTopScoresForGame(g); }));
    return result;
};

window.fbLoadMyScores = async function() {
    const user = auth.currentUser;
    if (!user) return {};
    const result = {};
    await Promise.all(GAMES.map(async g => {
        result[g] = await fetchTopScoresForGame(g, { uid: user.uid });
    }));
    return result;
};