document.addEventListener('DOMContentLoaded', async () => {
    const displayName = document.getElementById('internal-links-display-name');
    const subtitle = document.getElementById('internal-links-subtitle');
    const panelColor = document.getElementById('internal-links-panel-color');
    const panelColorText = document.getElementById('internal-links-panel-color-text');
    const useDefaultColors = document.getElementById('internal-links-default-colors');
    const panelWidth = document.getElementById('internal-links-panel-width');
    const panelHeight = document.getElementById('internal-links-panel-height');
    const useDefaultPanelSize = document.getElementById('internal-links-default-panel-size');
    const saveButton = document.getElementById('internal-links-branding-save');
    const message = document.getElementById('internal-links-branding-message');

    if (!displayName || !subtitle || !panelColor || !panelColorText || !useDefaultColors || !panelWidth || !panelHeight || !useDefaultPanelSize || !saveButton) return;

    const normalizeColor = value => /^#[0-9a-f]{6}$/.test(String(value || '').trim().toLowerCase()) ? String(value).trim().toLowerCase() : '#ffffff';
    const clamp = (value, min, max, fallback) => {
        const n = Number.parseInt(value, 10);
        return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : fallback;
    };

    function syncColorState() {
        const disabled = useDefaultColors.checked;
        panelColor.disabled = disabled;
        panelColorText.disabled = disabled;
    }

    function syncSizeState() {
        const disabled = useDefaultPanelSize.checked;
        panelWidth.disabled = disabled;
        panelHeight.disabled = disabled;
        if (disabled) {
            panelWidth.value = '1280';
            panelHeight.value = '560';
        }
    }

    panelColor.addEventListener('input', () => { panelColorText.value = panelColor.value.toLowerCase(); });
    panelColorText.addEventListener('change', () => {
        const normalized = normalizeColor(panelColorText.value);
        panelColorText.value = normalized;
        panelColor.value = normalized;
    });
    useDefaultColors.addEventListener('change', syncColorState);
    useDefaultPanelSize.addEventListener('change', syncSizeState);

    async function loadBranding() {
        const response = await fetch(OC.generateUrl('/apps/internal_links/branding'), { headers: { requesttoken: OC.requestToken } });
        if (!response.ok) throw new Error('Unable to load appearance settings.');
        const data = await response.json();
        const currentPanelColor = normalizeColor(data.panelColor);
        displayName.value = data.displayName || 'Business Links';
        subtitle.value = data.subtitle || '';
        panelColor.value = currentPanelColor;
        panelColorText.value = currentPanelColor;
        useDefaultColors.checked = data.useDefaultColors !== false;
        panelWidth.value = String(clamp(data.panelWidth, 700, 2400, 1280));
        panelHeight.value = String(clamp(data.panelHeight, 420, 1400, 560));
        useDefaultPanelSize.checked = data.useDefaultPanelSize !== false;
        syncColorState();
        syncSizeState();
    }

    saveButton.addEventListener('click', async () => {
        saveButton.disabled = true;
        message.textContent = 'Saving…';
        const normalizedPanelColor = normalizeColor(panelColorText.value);
        panelColor.value = normalizedPanelColor;
        panelColorText.value = normalizedPanelColor;
        const width = clamp(panelWidth.value, 700, 2400, 1280);
        const height = clamp(panelHeight.value, 420, 1400, 560);

        try {
            const response = await fetch(OC.generateUrl('/apps/internal_links/branding'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', requesttoken: OC.requestToken },
                body: JSON.stringify({
                    displayName: displayName.value.trim(), subtitle: subtitle.value.trim(),
                    panelColor: normalizedPanelColor, useDefaultColors: useDefaultColors.checked,
                    panelWidth: width, panelHeight: height, useDefaultPanelSize: useDefaultPanelSize.checked,
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Unable to save appearance settings.');
            displayName.value = data.displayName;
            subtitle.value = data.subtitle;
            panelColor.value = normalizeColor(data.panelColor);
            panelColorText.value = normalizeColor(data.panelColor);
            useDefaultColors.checked = data.useDefaultColors !== false;
            panelWidth.value = String(data.panelWidth || 1280);
            panelHeight.value = String(data.panelHeight || 560);
            useDefaultPanelSize.checked = data.useDefaultPanelSize !== false;
            syncColorState();
            syncSizeState();
            message.textContent = 'Appearance saved. Reload the page to apply the changes.';
        } catch (error) {
            console.error(error);
            message.textContent = error.message;
        } finally { saveButton.disabled = false; }
    });

    try { await loadBranding(); } catch (error) { console.error(error); message.textContent = error.message; }
});
