A general guide on how to add cookie consent settings to a website.

### Definitions
1. **CMP ([Consent Management Platform](https://cmppartnerprogram.withgoogle.com/#partners))** – A third-party service that manages user consent and compliance. Similar to a CRM but for cookie preferences: create an account, configure settings (text, colors, etc.), copy the generated script, and embed it into the website.
2. **Tag** – A piece of code (e.g., JavaScript or HTML) added to a website via Google Tag Manager (GTM) based on predefined conditions.
3. **GTM (Google Tag Manager)** – A web-based tag management system that allows you to add and manage tracking scripts (Tags) without manually modifying the website’s code.

### I. Identify Cookies and Scripts
1. **List all cookies used on the website:**
   - Manually, using [browser tools](https://www.cookieyes.com/blog/how-to-check-cookies-on-your-website-manually/).
   - Using a third-party service. For example, adding a CMP temporarily can generate a cookie list automatically. You can then save the list and remove the CMP script from the website.

2. **Identify the scripts that create these cookies:**
   - Manually, by determining which script/service generates each cookie:
     - Using script/service documentation, eg see the [list of cookies used by Google services](https://business.safety.google/adscookies/#:~:text=effectiveness%20of%20ads.-,Filter%20by,-%3A) (Google Analytics, YouTube, Google Ads, etc.).
     - Using DevTools (Google Chrome browser):
       1. Use [DevTools Privacy and security panel](https://privacysandbox.google.com/cookies/basics/cookie-tools#devtools_privacy_and_security_panel).
       2. Search by cookie name. Open **DevTools > Network** > Open Search panel (Ctrl+F) and type cookie name eg. "abc".
       3. Search by cookie name only in "Set-Cookie" headers. Open **DevTools > Network** > Open Search panel (Ctrl+F) and type "Set-Cookie". Open another Search panel (Ctrl+Shift+F) and type cookie name eg. "abc". [Check the script name](https://github.com/brdslls/consent-cookie/blob/master/public/search-origin-cookie-script.jpg).
   - Using third-party services. Some CMPs attempt to detect and list the scripts that create cookies (but their detection isn't always accurate).

3. **Assign the correct [Consent Type](https://developers.google.com/tag-platform/security/concepts/consent-mode#consent-types) to each script:**
   - `ad_storage`
   - `ad_user_data`
   - `ad_personalization`
   - `analytics_storage`
   - `personalization_storage`
   - `functionality_storage`
   - `security_storage`

### II. Move Scripts to GTM
1. **Decide which consent types users can disable.**
   - Users can be allowed to disable all cookies, but this may break parts of the website. As a compromise, users are often given the option to disable `ad_*`, `analytics_storage`, and `personalization_storage`, while a **Cookie Policy** page should inform them how to disable all cookies via browser settings.

2. **[Create a custom trigger](https://support.google.com/tagmanager/answer/7679316?hl=en#:~:text=conditions%20are%20met.-,Create%20a%20new%20trigger,-To%20create%20a) in GTM:**
   - **Trigger Type**: Custom Event
   - **Event Name**: `consentUpdated`
   - **Fires On**: All Custom Events

3. **For each script that requires user's consent:**
   - Add the script to GTM by [creating a tag](https://support.google.com/tagmanager/answer/14842872).
     - **Tag Type**: Use "Google Tag" for Google Analytics and (usually) "Custom HTML" for other scripts.
   - [Set the consent requirement](https://support.google.com/tagmanager/answer/10718549?hl=en#:~:text=Tag%20consent%20settings) for each tag:
     - Google Analytics: **No additional consent required**.
     - Other scripts: Set consent according to the assigned consent type (e.g., `ad_storage` for Facebook Pixel).
   - Configure **Tag Triggers** to fire on **All Pages** and **Custom Event: consentUpdated**.
   - Remove the original script from the website.
   - Handle all javascript (e.g., onclick="functionFromNotLoadedScript()") that could be broken if a script that requires user consent is not loaded.

### III. Add a Consent Banner to the Website
1. Add the [banner HTML](https://github.com/brdslls/consent-cookie/blob/main/consent-cookie-banner.html) to the website.
2. Include the [JavaScript functions](https://github.com/brdslls/consent-cookie/blob/main/consent-cookie-functions.js). For each Content type, add a list of cookies that should be deleted if that type has been denied.

### IV. PS
- [Funding choices](https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/funding-choices) is a easy-to-use "consent banner" for Google Ad Managers