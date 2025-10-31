function extractJobData() {
  let company = '';
  let role = '';

  // ROLE
  const roleEl = document.querySelector('h1, .job-title, .posting-title');
  if (roleEl) role = roleEl.innerText.trim();

  // JOBRIGHT
  const jobrightCompanyEl = document.querySelector('.index_company-row__vOzgg');
  if (jobrightCompanyEl) {
    const text = jobrightCompanyEl.innerText.trim();
    company = text.split('·')[0].trim(); // removes "· 1 hour ago"
  }

  // LINKEDIN
  if (!company) {
    const linkedInCompany = document.querySelector(
      '.job-details-jobs-unified-top-card__company-name a'
    );
    if (linkedInCompany) company = linkedInCompany.innerText.trim();
  }

  // FALLBACKS
  if (!company) {
    const fallbackSelectors = [
      '.job-company',
      '.company',
      '.posting-company',
      "a[href*='company']",
      'meta[property="og:site_name"]',
    ];
    for (const sel of fallbackSelectors) {
      const el = document.querySelector(sel);
      if (el) {
        company = el.content ? el.content.trim() : el.innerText.trim();
        break;
      }
    }
  }

  // RETURN
  return {
    company: company || 'Unknown Company',
    role: role || 'Unknown Role',
    date: new Date().toISOString().split('T')[0],
    status: 'Applied',
  };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'extract') {
    const data = extractJobData();
    sendResponse(data);
  }
});
