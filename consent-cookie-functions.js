/**
 * Send to Google Tag Manager the consent preferences and save it in localStorage
 */
function setConsent(consent) {
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments)};
  // set the consentMode based on the response to the consent banner
  const consentMode = {
    'security_storage': 'granted',
    'functionality_storage': 'granted',
    'personalization_storage': consent.preferences ? 'granted' : 'denied',
    'analytics_storage': consent.analytics ? 'granted' : 'denied',
    'ad_storage': consent.marketing ? 'granted' : 'denied',
    'ad_user_data': consent.marketing ? 'granted' : 'denied',
    'ad_personalization': consent.marketing ? 'granted' : 'denied'
  };
  // update the consent in Google Tag Manager
  gtag('consent', 'update', consentMode);
  // send custom event to trigger early denied custom tags in GTM
  gtag('event', 'consentUpdated');
  // save preferences to localStorage so they don't have to consent every time they visit the website
  localStorage.setItem('consentMode', JSON.stringify(consentMode));
  if(!consent.analytics || !consent.preferences){
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      // Trim whitespace from the beginning of the cookie string
      const cookie = cookies[i].trim();
      // Get the cookie name (everything before the first '=')
      const cookieName = cookie.split('=')[0];
      if (
        (!consent.analytics && (
          cookieName.startsWith('abc') ||
          cookieName === 'abc'
        ))
        ||
        (!consent.preferences && (
          cookieName.startsWith('abc') ||
          cookieName === 'abc'
        ))
      ) {
        // Delete the cookie by setting its expiration date to the past
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        // Also try to delete the cookie with domain specification
        const domain = window.location.hostname;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
        // Try with domain prefixed with a dot (for subdomains)
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;
      }
    }
  }
}
function acceptConsent() {
  // update the consent according to the Accept All option on the banner
  if (localStorage.getItem('consentMode') === null) {
    setConsent({
      preferences: true,
      analytics: true,
      marketing: true
    });
  }
};
function rejectConsent() {
  // update the consent according to the Rejects All option on the banner
  if (localStorage.getItem('consentMode') === null) {
    setConsent({
      preferences: false,
      analytics: false,
      marketing: false
    });
  }
};
function customizedConsent(e) {
  // update the consent according to the custom options on the banner
  let newConsent = {}
  const data = new FormData(e.target);
  const consent = {
    preferences: data.get('preferences_consent'),
    analytics: data.get('analytics_consent'),
    marketing: data.get('marketing_consent')
  };
  // fill out the newConsent object based on options the user selected
  Object.entries(consent).forEach(([key, value]) => {
    if (value === 'on') {
      newConsent[key] = 'granted';
    }
  });
  setConsent(newConsent);
}