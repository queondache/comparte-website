// Load the public Infomaniak export only after an explicit visitor action.
const loadButton = document.getElementById('nl-load');
const panel = document.getElementById('nl-panel');
const status = document.getElementById('nl-status');

loadButton.addEventListener('click', async () => {
  loadButton.disabled = true;
  status.textContent = status.dataset.loading;
  try {
    for (const source of document.querySelectorAll('[data-newsletter-script]')) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = source.dataset.newsletterScript;
        if (source.dataset.module) script.type = 'module';
        script.onload = resolve;
        script.onerror = reject;
        document.body.append(script);
      });
    }
    panel.hidden = false;
    loadButton.setAttribute('aria-expanded', 'true');
    loadButton.hidden = true;
    document.getElementById('nl-load-help').hidden = true;
    status.textContent = status.dataset.ready;
    document.getElementById('nl-email').focus();
  } catch {
    // Avoid partial reinitialization. A reload gives the visitor a clean retry.
    status.textContent = status.dataset.error;
  }
});
