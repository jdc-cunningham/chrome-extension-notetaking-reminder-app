const API_BASE_URL = 'http://localhost:5000';

const postAjax = (url, data, success) => {
  var params = typeof data == 'string' ? data : Object.keys(data).map(
          function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
      ).join('&');

  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  xhr.open('POST', url);
  xhr.onreadystatechange = function() {
      if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
  };
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(params);
  return xhr;
}

const hasShortcode = async () => {
  return new Promise(resolve => {
    chrome.storage.local.get('cenra_shortcode', (result) => {
      console.log(result);
      if (result?.cenra_shortcode) {
        resolve(result.cenra_shortcode);
      } else {
        resolve(null);
      }
    });
  });
}

// returns shortcode to popup ui if successful
const login = (username, password) => {
  postAjax(`${API_BASE_URL}/login-user`, {username, password}, (res) => {
    const response = JSON.parse(res);

    if (response?.shortcode) {
      chrome.storage.local.set({
        "cenra_shortcode": response.shortcode
      });

      chrome.runtime.sendMessage({
        loggedIn: true,
        shortcode: response.shortcode
      });
    } else {
      chrome.runtime.sendMessage({
        loggedIn: false
      });
    }
  });
}

// run stuff on startup
chrome.runtime.onInstalled.addListener(async () => {
  // 
});

// listen for messages from popup ui
chrome.runtime.onMessage.addListener(async (request, sender, callback) => {
  const msg = request;

  if (msg?.get_shortcode) {
    const shortcode = await hasShortcode();
    chrome.runtime.sendMessage({shortcode})
  }

  if (msg?.login) {
    login(msg.login.username, msg.login.password);
  }
});