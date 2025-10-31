document.addEventListener('DOMContentLoaded', () => {
  const trackBtn = document.getElementById('trackBtn');
  const exportBtn = document.getElementById('exportBtn');
  const clearBtn = document.getElementById('clearBtn');
  const messageEl = document.getElementById('message');
  const tbody = document.getElementById('jobBody');
  const jobCount = document.getElementById('jobCount');
  const toggleBtn = document.getElementById('toggleJobsBtn');
  const jobsContainer = document.getElementById('jobsContainer');

  //Toggle job list visibility
  toggleBtn.addEventListener('click', () => {
    if (jobsContainer.style.display === 'none') {
      jobsContainer.style.display = 'block';
      toggleBtn.textContent = '🙈 Hide Saved Jobs';
    } else {
      jobsContainer.style.display = 'none';
      toggleBtn.textContent = '👁️ View Saved Jobs';
    }
  });

  //Track button
  trackBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    try {
      // Try sending message to content script
      chrome.tabs.sendMessage(
        tab.id,
        { action: 'extract' },
        async (response) => {
          if (chrome.runtime.lastError) {
            messageEl.innerText =
              '⚠️ Unable to extract — open a job page first.';
            return;
          }

          if (response) {
            const { jobs } = await chrome.storage.sync.get('jobs');
            const updatedJobs = jobs || [];
            updatedJobs.push(response);
            await chrome.storage.sync.set({ jobs: updatedJobs });
            messageEl.innerText = '✅ Job tracked!';
            renderJobs();
          } else {
            messageEl.innerText = '⚠️ No job details found on this page.';
          }
        }
      );
    } catch (err) {
      messageEl.innerText = '⚠️ Could not connect to page.';
    }
  });

  async function renderJobs(filterText = '') {
    const { jobs } = await chrome.storage.sync.get('jobs');
    const jobList = jobs || [];

    // Update count
    jobCount.textContent = `(${jobList.length})`;

    // Filter jobs by company name (case-insensitive)
    const filteredJobs = jobList.filter((job) =>
      job.company.toLowerCase().includes(filterText.toLowerCase())
    );

    tbody.innerHTML = '';

    filteredJobs.forEach((job, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
      <td>${job.company}</td>
      <td>${job.role}</td>
      <td>${job.date}</td>
      <td>${job.status}</td>
      <td><button class="delete-btn" data-index="${index}">✖</button></td>
    `;
      tbody.appendChild(row);
    });

    // Attach delete listeners
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        const updatedJobs = jobList.filter((_, i) => i !== index);
        await chrome.storage.sync.set({ jobs: updatedJobs });
        renderJobs(filterText);
      });
    });
  }

  // Search listener
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const text = e.target.value;
      renderJobs(text);
    });
  }

  // Export CSV Button
  exportBtn.addEventListener('click', async () => {
    const { jobs } = await chrome.storage.sync.get('jobs');
    if (!jobs || !jobs.length) return;

    const rows = [
      ['Company', 'Role', 'Date', 'Status'],
      ...jobs.map((j) => [
        `"${j.company.replace(/"/g, '""')}"`,
        `"${j.role.replace(/"/g, '""')}"`,
        j.date,
        j.status,
      ]),
    ];

    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'trakr_jobs.csv';
    a.click();
  });

  // Clear all Button
  clearBtn.addEventListener('click', async () => {
    await chrome.storage.sync.set({ jobs: [] });
    renderJobs();
  });

  renderJobs();
});
