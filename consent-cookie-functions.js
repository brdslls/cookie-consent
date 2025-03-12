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