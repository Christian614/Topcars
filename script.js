function showContent(sectionId) {
    var sections = document.querySelectorAll('.content-section');

    sections.forEach(function(section) {
        section.style.display = 'none';
    });

    var selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}
// const box = document.querySelector(".box");
// box.style.backgroundColor = "red"
// let oldValue = 0
// var newValue = window.scrollY
// console.log(newValue)
// window.addEventListener("scroll" , function(){
//     if(newValue = 1432){
//         box.style.position = "fixed"
//     } else if (newValue ){

//     }
// })

// --- Simple auth (signup / login) using localStorage (demo only) ---
document.addEventListener('DOMContentLoaded', function() {
    var authModal = document.getElementById('auth-modal');
    var loginForm = document.getElementById('login-form');
    var signupForm = document.getElementById('signup-form');
    var showSignup = document.getElementById('show-signup');
    var showLogin = document.getElementById('show-login');
    var greetEl = document.getElementById('greeting');
    var greetText = document.getElementById('greet-text');
    var signoutBtn = document.getElementById('signout-btn');
    var modalClose = document.getElementById('modal-close');
    var authError = document.getElementById('auth-error');
    var googleBtn = document.getElementById('google-login');

    // Helper: show inline error
    function showError(msg){ authError.textContent = msg; authError.style.display = msg ? 'block' : 'none'; }

    // Toggle forms (UI only)
    showSignup && showSignup.addEventListener('click', function(e){ e.preventDefault(); loginForm.style.display = 'none'; signupForm.style.display = 'flex'; document.getElementById('modal-title').textContent = 'Create account'; showError(''); });
    showLogin && showLogin.addEventListener('click', function(e){ e.preventDefault(); signupForm.style.display = 'none'; loginForm.style.display = 'flex'; document.getElementById('modal-title').textContent = 'Welcome back'; showError(''); });

    // Firebase Auth integration
    function getFirebase(){ return window._fb && window._fb.auth ? window._fb : null; }

    // Signup with Firebase
    signupForm.addEventListener('submit', function(e){
        e.preventDefault();
        showError('');
        var username = document.getElementById('signup-username').value.trim();
        var email = document.getElementById('signup-email').value.trim();
        var pass = document.getElementById('signup-password').value;
        if(!username || !email || !pass){ showError('Please fill all fields'); return; }
        var fb = getFirebase();
        if(!fb){ showError('Firebase not configured. Paste config into index.html.'); return; }
        const { createUserWithEmailAndPassword, updateProfile } = fb.authModule;
        const auth = fb.auth;
        createUserWithEmailAndPassword(auth, email, pass)
            .then(userCred => {
                // set displayName
                return updateProfile(userCred.user, { displayName: username });
            })
            .then(() => { showError(''); closeModal(); })
            .catch(err => { showError(err.message || 'Signup error'); });
    });

    // Login with Firebase
    loginForm.addEventListener('submit', function(e){
        e.preventDefault();
        showError('');
        var emailOrUser = document.getElementById('login-username').value.trim();
        var pass = document.getElementById('login-password').value;
        if(!emailOrUser || !pass){ showError('Please enter email/username and password'); return; }
        var fb = getFirebase();
        if(!fb){ showError('Firebase not configured. Paste config into index.html.'); return; }
        const { signInWithEmailAndPassword } = fb.authModule;
        const auth = fb.auth;
        // Attempt sign in by email first
        signInWithEmailAndPassword(auth, emailOrUser, pass)
            .then(cred => { showError(''); closeModal(); })
            .catch(err => {
                // if failed, don't try username->email mapping here; show error
                showError(err.message || 'Login error');
            });
    });

    // Google sign-in
    googleBtn && googleBtn.addEventListener('click', function(){
        showError('');
        var fb = getFirebase();
        if(!fb){ showError('Firebase not configured. Paste config into index.html.'); return; }
        const { GoogleAuthProvider, signInWithPopup } = fb.authModule;
        const auth = fb.auth;
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then(() => { showError(''); closeModal(); }).catch(err => { showError(err.message || 'Google sign-in error'); });
    });

    // Sign out (Firebase)
    signoutBtn && signoutBtn.addEventListener('click', function(){
        var fb = getFirebase();
        if(fb){ const { signOut } = fb.authModule; signOut(fb.auth).then(() => { greetEl.style.display = 'none'; openModal(); }); }
        else{ greetEl.style.display = 'none'; openModal(); }
    });

    function updateUIForUser(user){
        if(!user) return;
        var name = user.displayName || user.email || 'User';
        greetText.textContent = 'Hello, ' + name;
        greetEl.style.display = 'flex';
    }

    function openModal(){
        authModal && authModal.setAttribute('aria-hidden', 'false');
        authModal && (authModal.style.display = 'flex');
        loginForm.style.display = 'flex';
        signupForm.style.display = 'none';
        document.getElementById('modal-title').textContent = 'Welcome';
        showError('');
        // focus first input
        setTimeout(function(){
            var first = loginForm.querySelector('input');
            first && first.focus();
        },50);
    }

    function closeModal(){
        authModal && authModal.setAttribute('aria-hidden', 'true');
        authModal && (authModal.style.display = 'none');
    }

    // Close button
    modalClose && modalClose.addEventListener('click', function(){ closeModal(); });

    // ESC to close modal (only when open)
    document.addEventListener('keydown', function(e){
        if(e.key === 'Escape'){
            if(authModal && authModal.getAttribute('aria-hidden') === 'false'){
                closeModal();
            }
        }
    });

    // Initialize Firebase auth listener
    (function initAuth(){
        // wait for firebase to load
        var checkInterval = setInterval(function(){
            var fb = getFirebase();
            if(fb){
                clearInterval(checkInterval);
                const { onAuthStateChanged } = fb.authModule;
                onAuthStateChanged(fb.auth, function(user){
                    if(user){ updateUIForUser(user); closeModal(); }
                    else{ openModal(); }
                });
            }
        },250);
        // stop checking after a few seconds to avoid infinite loop
        setTimeout(function(){ clearInterval(checkInterval); }, 10000);
    })();

});