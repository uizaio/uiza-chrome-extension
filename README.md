# UIZA Extension

<div align="center">
    <img src="static/icons/64.png?raw=true" />
</div>

This extension is used for demo purpose.

## Installation and running locally

Make sure you have NodeJS & all dependencies installed by running
`yarn` or `npm install`

**Note**
```
Node.js version 7.x or greater is needed
```

Start the development server by running

```
yarn run dev
```

Basically something similar to what the webpack hot reload middleware does. When you change the code and the webpack trigger and finish the compilation, your extension is notified and then reloaded using the standard browser runtime API.

Open your Chrome browser and navigate to `chrome://extensions` to load the extension in **Developer mode**
- Turn on **Developer mode**
- Click the button **Load Unpacked** to browse to the cloned repository's `build` folder
- Make a change then see if the extension's content is reloaded


## Building & Publishing

```
yarn build
```
Follow this guide to publish this extension to Chrome Web Store https://developer.chrome.com/webstore/publish

## License

This project is under ...