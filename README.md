### About

This is yet another note taking app I made. The gimmick for this one is it injects an iframe into any page if you want to have an automated reminder.

It is an iframe in order to make sure the website can't read the authenticated context.

You login through the `background.js` script.

### How does it work?

There are three parts to this:

* chrome extension
* web app
* web API

The chrome extension (popup-ui) uses the chrome local storage and teh web API to check for a shortcode.

If you have a shortcode you can then use the injected webapp that's in an iframe. You enter the shortcode into the iframe in order to be in an authenticated state. Then you can use the note taking app tools/search existing notes.

The iframe is injected into every website you visit. It's either on the side or on the bottom depending on the width/aspect ratio of the website.

The downside of this project is that shortcode/persisting it. It persists in the chrome extension icon drop down window but you have to manually put it into the iframe until I figure out a way to bridge that securely without giving the shortcode/JWT to the website the iframe is embedded in.

### Why was this made?

One of the main reasons which was kind of not directly achieved is a reminder... it would just appear on any website. `BOOM!` Injected in your face. Also I can always take notes of whatever random thing I'm looking at.

I had that ability before with the [dropdown version](https://github.com/jdc-cunningham/nanta-chrome-extension) and my other app variants. This way is supposed to be more convenient/is in my face.

### Features

- somehow toggle iFrame transparency in case blocking stuff, be ideal if toggle was on the iframe itself

### Disclaimer/Security vulnerability

It is possible for the iframe to be overlaid by someone else. So they could intercept the iframe interface you're trying to click on/type into. Keep this in mind with iframes in general. This is why the iframe pulsates.

