const GA_SCRIPT_ID = "ga-gtag-script";

export const initAnalytics = (measurementId) => {
  if (!measurementId || typeof document === "undefined") return;
  if (document.getElementById(GA_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  const gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag = window.gtag || gtag;
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { anonymize_ip: true });
};
