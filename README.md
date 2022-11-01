# OBS METAR

This is a small application that uses [avwx](https://avwx.rest) to get METAR information and return it in a way that can be used in an [OBS](https://obsproject.com/) Browser.

[![Netlify Status](https://api.netlify.com/api/v1/badges/c59bc67f-6ac3-4a1b-92d1-918035fe3636/deploy-status)](https://app.netlify.com/sites/splendorous-trifle-8d0775/deploys)

This documentation pertains to the website [https://metar.cr0wst.dev](https://metar.cr0wst.dev)

## Usage

The page will show a plain-text raw METAR readout for all the given weather stations. The following query parameters are used:

- `accessKey` This is your [avwx](https://avwx.rest) token. This token is only used to access the API on your behalf and is not intentionally stored anywhere on the server.
- `stations` This is a comma-separated list of stations to retrieve METARs for. Example: `ksdf,klou`
- `refreshMs` The number of `ms` to wait before each refresh interval. Depending on your access token, you may want to limit this to prevent going over your monthly quota.

> **Note on `accessKey`** I do not store this information anywhere on the server, it is only used to access the weather API with your credentials. That being said, it is passed as a query parameter and might be logged somewhere outside of my control. 
> 
> For best results, I would suggest making a separate token on avwx to use specifically for this service. I have no ill will or intentions for your `accessKey`.
> 

### Example: Fetching METAR information for Columbus and Dayton (API):

```
curl -X GET https://metar.cr0wst.dev/api?stations=kcmh,kday&accessKey=YOUR_ACCESS_TOKEN
```

This will return an array of `metars` which are results from avwx.

### Example: OBS Browser for Columbus and Dayton (Non API)

Add a new browser source to OBS with the following URL:

```
https://metar.cr0wst.dev?stations=kcmh,kday&accessKey=YOUR_ACCESS_TOKEN&refreshMs=60000
```

This page will refresh the data every 10 minutes. Each METAR entry is wrapped in a `div` with a class called `metar-wrapper` which can be used to format it to your liking.

## Local Setup

To start run `npm install` followed by `npm run dev`.
