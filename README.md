### About (local iframe)

<img src="./demo2.gif" max-width="800" width="100%" style="margin-bottom: 32px;"/>

This injected iframe is using the `popup ui` as the iframe content. It's hitting a local API/DB eg. `http://192...` so it doesn't need all the server setup/website but it's in the other branch.

I did some testing and this seems... secure but I can't guarantee it. I've attached references below.

Use at your own risk, I've mentioned other vulnerabilities.

### Features

- somehow toggle iFrame transparency in case blocking stuff, be ideal if toggle was on the iframe itself

### Disclaimer/Security vulnerability

It is possible for the iframe to be overlaid by someone else. So they could intercept the iframe interface you're trying to click on/type into. Keep this in mind with iframes in general. This is why the iframe pulsates.

### secure

* https://stackoverflow.com/questions/61446288/chrome-extension-safely-communicate-from-executed-script-to-background-script
### not secure

* https://blog.ankursundara.com/shadow-dom/

You decide (lol)

### Icons

From UXWing