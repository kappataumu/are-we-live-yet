# Are we live yet?

`Awly.js` uses asset latency to determine if you are viewing a production or development host.

This is based on the assumption that you are developing `example.com` in a local VM, using a `hosts` entry to point to it. Toggling this `hosts` entry allows browsing the production host again. But often caching is stubborn, causing you to do a double take.

This is where `Awly.js` comes into play. A green visual cue is shown on the bottom right of the browser window when asset latency is < 25ms. Green means you are viewing your local VM and any edits should be immediately visible.

This will clearly not work if all your static assets are, say, on S3 and shared between environments.

Nothing will be displayed when `Awly.js` detects you are viewing the production website, unless you specify so yourself by toggling the `verbose` configuration option. In that case, the visual indicator will always be shown, alternating between green and red for development and production respectively. The TTFB for the given asset will also be shown.


## Usage

First, make sure to load `Awly.js`:

```
<script src="/path/to/awly.min.js"></script>
```

Then you must explicitly run it:

```
<script>
  Awly.run();
</script>
```

That's it.

## Configuration

All the configuration parameters are optional. Here are the defaults:

```
<script>
  Awly.run({
    asset: document.getElementsByTagName('img')[0].src,
    cssClassName: 'awly',
    ttfbProdThreshold: 25,
    verbose: false,
  });
</script>
```
