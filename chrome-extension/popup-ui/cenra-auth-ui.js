/**
 * this is the little window that pops up when you click a chrome extension icon
 * for this particular usecase this window is used to either login or show a shortcode from the login process
 * the shortcode is not copyable to the clipboard on purpose in order to not expose it to whatever
 * website the remote origin iframe is injected in
 * unfortunately at this time the shortcode is manually typed into the iframe for auth
 * until I figure out a way to persist say a JWT token between popupui/bg script and iframe
 * 
 * the API requests are done through the background.js script
 * 
 * anytime the popup ui opens, this whole script runs
 */

// was initially only binding things as needed
const loginForm = document.getElementById('login-form');
const shortcodeText = document.getElementById('shortcode-text');
const shortcodeDisplay = document.getElementById('show-shortcode');

const setupLoginForm = (loginForm, shortcodeDisplay) => {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginButton = document.getElementById('login');

  loginButton.addEventListener('click', () => {
    if (!usernameInput.value || !passwordInput.value) {
      alert('please fill in both fields');
      return;
    }

    chrome.runtime.sendMessage({
      login: {
        username: usernameInput.value,
        password: passwordInput.value
      }
    }); // failing to handle async callback
  });
}

const toggleLogin = (shortcode) => {
  const checkingShortcodeStatus = document.getElementById('getting-shortcode');

  checkingShortcodeStatus.classList = checkingShortcodeStatus.classList + ' hidden';

  if (shortcode) {
    shortcodeText.innerText = shortcode;
    shortcodeDisplay.classList = 'cenra-auth-ui__has-shortcode';
  } else {
    loginForm.classList = 'cenra-auth-ui__no-shortcode';
    setupLoginForm(loginForm, shortcodeDisplay);
  }
}

// run stuff on startup
chrome.runtime.onInstalled.addListener(async () => {
  // not sure when this runs extension installation?
});

chrome.runtime.onMessage.addListener((request, sender, callback) => {
  const msg = request;

  console.log('ui', msg);

  if ('shortcode' in msg) { // can be null
    toggleLogin(msg.shortcode);
  }

  if ('loggedIn' in msg) {
    if (msg?.loggedIn) {
      shortcodeText.innerText = msg.shortcode;
      loginForm.classList = loginForm.classList + ' hidden';
      shortcodeDisplay.classList = 'cenra-auth-ui__has-shortcode';
    } else {
      alert('Failed to login');
    }
  }
});

// init
chrome.runtime.sendMessage({get_shortcode: true}); // dumb