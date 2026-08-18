document.addEventListener('DOMContentLoaded', async () => {
    const displayName = document.getElementById('internal-links-display-name');
    const subtitle = document.getElementById('internal-links-subtitle');
    const panelColor = document.getElementById('internal-links-panel-color');
    const panelColorText = document.getElementById('internal-links-panel-color-text');
    const useDefaultColors = document.getElementById('internal-links-default-colors');
    const saveButton = document.getElementById('internal-links-branding-save');
    const message = document.getElementById('internal-links-branding-message');

    if (!displayName || !subtitle || !panelColor || !panelColorText || !useDefaultColors || !saveButton) {
        return;
    }

    function normalizeColor(value) {
        const color = String(value || '').trim().toLowerCase();
        return /^#[0-9a-f]{6}$/.test(color) ? color : '#ffffff';
    }

    function syncColorState() {
        const disabled = useDefaultColors.checked;
        panelColor.disabled = disabled;
        panelColorText.disabled = disabled;
    }

    panelColor.addEventListener('input', () => {
        panelColorText.value = panelColor.value.toLowerCase();
    });

    panelColorText.addEventListener('change', () => {
        const normalized = normalizeColor(panelColorText.value);
        panelColorText.value = normalized;
        panelColor.value = normalized;
    });

    useDefaultColors.addEventListener('change', syncColorState);

    async function loadBranding() {
        const response = await fetch(
            OC.generateUrl('/apps/internal_links/branding'),
            { headers: { requesttoken: OC.requestToken } }
        );

        if (!response.ok) {
            throw new Error('Unable to load appearance settings.');
        }

        const data = await response.json();
        const currentPanelColor = normalizeColor(data.panelColor);

        displayName.value = data.displayName || 'Business Links';
        subtitle.value = data.subtitle || '';
        panelColor.value = currentPanelColor;
        panelColorText.value = currentPanelColor;
        useDefaultColors.checked = data.useDefaultColors !== false;
        syncColorState();
    }

    saveButton.addEventListener('click', async () => {
        saveButton.disabled = true;
        message.textContent = 'Saving…';

        const normalizedPanelColor = normalizeColor(panelColorText.value);
        panelColor.value = normalizedPanelColor;
        panelColorText.value = normalizedPanelColor;

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
                        panelColor: normalizedPanelColor,
                        useDefaultColors: useDefaultColors.checked,
                    }),
                }
            );

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Unable to save appearance settings.');
            }

            displayName.value = data.displayName;
            subtitle.value = data.subtitle;
            panelColor.value = normalizeColor(data.panelColor);
            panelColorText.value = normalizeColor(data.panelColor);
            useDefaultColors.checked = data.useDefaultColors !== false;
            syncColorState();
            message.textContent = 'Appearance saved. Reload the page to apply the changes.';
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
