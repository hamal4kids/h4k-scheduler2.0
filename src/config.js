const BASE = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSHaKUPkelB1q5Iu7NPhMO05ylqnfOI3TjuAv3BrXsbfZ7iiajCGE2a0Pg7TN_LTOQhVJcKn0Ufn08D/pub';

export const SHEETS = {
  posts:    `${BASE}?gid=0&single=true&output=csv`,
  groups:   `${BASE}?gid=1&single=true&output=csv`,
  sent_log: `${BASE}?gid=2&single=true&output=csv`,
};

export const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK;
export const APP_PIN         = import.meta.env.VITE_PIN;
