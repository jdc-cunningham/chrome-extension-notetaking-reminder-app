const IFRAME_DOMAIN = "";
const iframe = `<iframe id="cenra-custom" src="${IFRAME_DOMAIN}"/>`;

window.onload = () => {
  document.body.insertAdjacentHTML('beforeend', iframe);
};