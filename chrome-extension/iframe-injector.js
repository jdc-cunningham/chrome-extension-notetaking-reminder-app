// https://stackoverflow.com/a/11530115/2710227
// https://stackoverflow.com/a/67613697/2710227

const iframeWrapper = document.createElement('div');
const iframeShadow = iframeWrapper.attachShadow({mode: 'closed'});
const iframe = document.createElement('iframe');
iframe.src = chrome.runtime.getURL('./popup-ui/index.html');
iframe.id = 'cenra-custom';

iframeShadow.appendChild(iframe);

window.onload = () => {
  document.body.appendChild(iframeWrapper);
};