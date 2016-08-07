# Cordova/datastores task example

This is a modified version of the task tracking example that ships with the [Dropbox Datastore JavaScript SDK](https://www.dropbox.com/developers/datastore/sdks/js). This version has been modified to run in the context of a Cordova app.

Aside from UI changes to match the phone form factor, the two main modification were:

* Use the Cordova auth driver with `client.authDriver(new Dropbox.AuthDriver.Cordova());`
* Use the `deviceready` event instead of the standard document `ready` event with `document.addEventListener("deviceready", function () { ... }, false);` instead of `$(function () { ... })`.

## Run instructions

To run this, you need to create a Cordova project and include these files in the `www` directory of your project:

1. Create a Cordova app with `cordova create cordova_datastores` (or choose your own name).
2. Go into the directory you just created and run `cordova plugins add org.apache.cordova.inappbrowser`. The InAppBrowser is used by the Dropbox Datastore SDK to perform the OAuth authorization flow.
3. Remove everything in the `www` directory and clone this git repo into `www` to replace it.
4. Add platforms (`cordova platforms add ...`) and run (`cordova run ...`) as you would in any other Cordova project.

## Using your own app

If you want to build your own Cordova app using the Datastore API, you'll first need to create an API app via the [Dropbox App Console](https://www.dropbox.com/developers/apps). You'll nened to use the app key you receive when you create your `Dropbox.Client` object. (In `tutorial.js`, you'll find a variable called `DROPBOX_APP_KEY`. This is what you would need to replace to use your own app key.) Be sure to add `https://www.dropbox.com/1/oauth2/redirect_receiver` as an OAuth 2 redirect URI in the App Console, since this is the redirect URI used by default by the Cordova auth driver.
