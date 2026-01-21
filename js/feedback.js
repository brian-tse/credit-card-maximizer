// CardMax - Feedback Widget
// Floating button to report inaccuracies

(function() {
  // Web3Forms key (same as card suggestions)
  const WEB3FORMS_KEY = '9295b1da-e117-4432-bc64-658ab416d2aa';

  // Inject the HTML
  const feedbackHTML = `
    <!-- Floating Feedback Button -->
    <button class="feedback-fab" id="feedback-fab" aria-label="Report an issue">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </button>

    <!-- Feedback Modal -->
    <div class="feedback-modal-overlay" id="feedback-modal">
      <div class="feedback-modal">
        <div class="feedback-modal-header">
          <h3>Report an Inaccuracy</h3>
          <button class="feedback-modal-close" id="feedback-close">&times;</button>
        </div>
        <form id="feedback-form">
          <div class="feedback-modal-body">
            <div class="feedback-disclaimer">
              <strong>Disclaimer:</strong> Credit card benefits and perks are subject to change at any time. While we strive for accuracy, information displayed may be outdated or incorrect. Always verify details with the card issuer.
            </div>

            <div class="feedback-form-group">
              <label for="feedback-card">Card Name</label>
              <input type="text" id="feedback-card" name="card" placeholder="e.g., Amex Platinum" required>
            </div>

            <div class="feedback-form-group">
              <label for="feedback-type">Issue Type</label>
              <select id="feedback-type" name="type" required>
                <option value="">Select an issue type...</option>
                <option value="incorrect-benefit">Incorrect benefit/perk</option>
                <option value="missing-benefit">Missing benefit/perk</option>
                <option value="wrong-amount">Wrong credit amount</option>
                <option value="outdated-info">Outdated information</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="feedback-form-group">
              <label for="feedback-details">Details</label>
              <textarea id="feedback-details" name="details" placeholder="Please describe what's incorrect and what the correct information should be..." required></textarea>
            </div>

            <div class="feedback-form-group">
              <label for="feedback-source">Source (optional)</label>
              <input type="text" id="feedback-source" name="source" placeholder="Link to official source if available">
            </div>
          </div>
          <div class="feedback-modal-footer">
            <button type="button" class="btn btn-secondary" id="feedback-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary" id="feedback-submit">Submit Report</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Insert into DOM when ready
  document.addEventListener('DOMContentLoaded', function() {
    document.body.insertAdjacentHTML('beforeend', feedbackHTML);
    initFeedbackWidget();
  });

  function initFeedbackWidget() {
    const fab = document.getElementById('feedback-fab');
    const modal = document.getElementById('feedback-modal');
    const closeBtn = document.getElementById('feedback-close');
    const cancelBtn = document.getElementById('feedback-cancel');
    const form = document.getElementById('feedback-form');
    const submitBtn = document.getElementById('feedback-submit');

    // Open modal
    fab.addEventListener('click', () => {
      modal.classList.add('active');
    });

    // Close modal
    function closeModal() {
      modal.classList.remove('active');
      form.reset();
    }

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const formData = {
        access_key: WEB3FORMS_KEY,
        subject: `CardMax Inaccuracy Report: ${form.card.value}`,
        card_name: form.card.value,
        issue_type: form.type.value,
        details: form.details.value,
        source: form.source.value || 'Not provided',
        page_url: window.location.href,
        from_name: 'CardMax Feedback Widget'
      };

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
          alert('Thank you! Your report has been submitted.');
          closeModal();
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (error) {
        console.error('Feedback error:', error);
        alert('Error submitting report. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Report';
      }
    });
  }
})();
