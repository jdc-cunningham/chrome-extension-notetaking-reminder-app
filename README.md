### About

This is yet another note taking app I made. The gimmick for this one is it injects an iframe into any page if you want to have an automated reminder.

It is an iframe in order to make sure the website can't read the authenticated context.

You login through the `background.js` script.

### Usage

You login to the remote server using the popup ui that appears when clicking the Chrome extension icon. Then you have a session in your remote server that's active. The issue right now which I have not solved yet is how to get the JWT into the iframe without the parent website being able to get the JWT token... so until I get that setup, I'm using a shortcode. The short code is like a JWT but not... well it's purpose is to prove authentication and its managed on the server side. You would then remember this shortcode probably 6 strings it's 6^62 complexity so that should be good enough. Lasts a day. Paste it into the injected iframe which is injected on every page. It's not ideal but a solution for now. I can't append it to the iframe url because that's public to the parent website.

The point of this app is just note taking but it has information about myself which I don't want random websites to be able to pick up.

