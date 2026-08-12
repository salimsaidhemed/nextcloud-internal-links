document.addEventListener('DOMContentLoaded', async () => {
    const displayName = document.getElementById('internal-links-display-name');
    const subtitle = document.getElementById('internal-links-subtitle');
    const saveButton = document.getElementById('internal-links-branding-save');
    const message = document.getElementById('internal-links-branding-message');

    if (!displayName || !subtitle || !saveButton) {
        return;
    }

    async function loadBranding() {
        const response = await fetch(
            OC.generateUrl('/apps/internal_links/branding'),
            { headers: { requesttoken: OC.requestToken } }
        );

        if (!response.ok) {
            throw new Error('Unable to load appearance settings.');
        }

        const data = await response.json();
        displayName.value = data.displayName || 'Business Links';
        subtitle.value = data.subtitle || '';
    }

    saveButton.addEventListener('click', async () => {
        saveButton.disabled = true;
        message.textContent = 'Saving…';

        try {
            const response = await fetch(
                OC.generateUrl('/apps/internal_links/branding'),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        requesttoken: OC.requestToken,
                    },
                    body: JSON.stringify({
                        displayName: displayName.value.trim(),
                        subtitle: subtitle.value.trim(),
                    }),
                }
            );

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Unable to save appearance settings.');
            }

            displayName.value = data.displayName;
            subtitle.value = data.subtitle;
            message.textContent = 'Appearance saved. Reload the page to refresh the navigation label.';
        } catch (error) {
            console.error(error);
            message.textContent = error.message;
        } finally {
            saveButton.disabled = false;
        }
    });

    try {
        await loadBranding();
    } catch (error) {
        console.error(error);
        message.textContent = error.message;
    }
});
