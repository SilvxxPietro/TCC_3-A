// Em produção, defina window.APP_CONFIG.API_BASE_URL antes deste arquivo.
window.APP_CONFIG = window.APP_CONFIG || {};
window.API_BASE_URL = window.APP_CONFIG.API_BASE_URL || window.location.origin;
window.API_BASE_URL =
  window.APP_CONFIG?.API_BASE_URL || "http://localhost:3000";