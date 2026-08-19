document.addEventListener('DOMContentLoaded', async () => {
    const $ = id => document.getElementById(id);
    const displayName = $('internal-links-display-name');
    const subtitle = $('internal-links-subtitle');
    const panelColor = $('internal-links-panel-color');
    const panelColorText = $('internal-links-panel-color-text');
    const useDefaultColors = $('internal-links-default-colors');
    const panelWidth = $('internal-links-panel-width');
    const panelHeight = $('internal-links-panel-height');
    const useDefaultPanelSize = $('internal-links-default-panel-size');
    const useDefaultTileStyle = $('internal-links-default-tile-style');
    const tileBackground = $('internal-links-tile-background');
    const tileBackgroundText = $('internal-links-tile-background-text');
    const tileBorder = $('internal-links-tile-border');
    const tileBorderText = $('internal-links-tile-border-text');
    const tileHoverBorder = $('internal-links-tile-hover-border');
    const tileHoverBorderText = $('internal-links-tile-hover-border-text');
    const iconBackground = $('internal-links-icon-background');
    const iconBackgroundText = $('internal-links-icon-background-text');
    const tileRadius = $('internal-links-tile-radius');
    const tileDensity = $('internal-links-tile-density');
    const showDescriptions = $('internal-links-show-descriptions');
    const tilePreview = $('internal-links-tile-preview');
    const saveButton = $('internal-links-branding-save');
    const message = $('internal-links-branding-message');

    if (!displayName || !saveButton) return;

    const normalizeColor = (value, fallback = '#ffffff') => {
        const color = String(value || '').trim().toLowerCase();
        return /^#[0-9a-f]{6}$/.test(color) ? color : fallback;
    };
    const clamp = (value, min, max, fallback) => {
        const n = Number.parseInt(value, 10);
        return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : fallback;
    };

    const colorPairs = [
        [panelColor, panelColorText, '#ffffff'],
        [tileBackground, tileBackgroundText, '#ffffff'],
        [tileBorder, tileBorderText, '#c7c7c7'],
        [tileHoverBorder, tileHoverBorderText, '#0082c9'],
        [iconBackground, iconBackgroundText, '#f2f2f2'],
    ];

    colorPairs.forEach(([picker, text, fallback]) => {
        picker?.addEventListener('input', () => {
            text.value = picker.value.toLowerCase();
            updatePreview();
        });
        text?.addEventListener('change', () => {
            const value = normalizeColor(text.value, fallback);
            text.value = value;
            picker.value = value;
            updatePreview();
        });
    });

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

    function syncTileState() {
        const disabled = useDefaultTileStyle.checked;
        [tileBackground, tileBackgroundText, tileBorder, tileBorderText, tileHoverBorder, tileHoverBorderText, iconBackground, iconBackgroundText, tileRadius]
            .forEach(el => { if (el) el.disabled = disabled; });
        updatePreview();
    }

    function updatePreview() {
        if (!tilePreview) return;
        const useDefault = useDefaultTileStyle.checked;
        tilePreview.style.background = useDefault ? 'var(--color-main-background)' : normalizeColor(tileBackgroundText.value);
        tilePreview.style.borderColor = useDefault ? 'var(--color-border)' : normalizeColor(tileBorderText.value, '#c7c7c7');
        tilePreview.style.borderRadius = `${useDefault ? 12 : clamp(tileRadius.value, 0, 32, 12)}px`;
        const icon = tilePreview.querySelector('.tile-preview-icon');
        if (icon) icon.style.background = useDefault ? 'var(--color-background-hover)' : normalizeColor(iconBackgroundText.value, '#f2f2f2');
        const small = tilePreview.querySelector('small');
        if (small) small.hidden = !showDescriptions.checked;
        tilePreview.dataset.density = tileDensity.value;
    }

    useDefaultColors.addEventListener('change', syncColorState);
    useDefaultPanelSize.addEventListener('change', syncSizeState);
    useDefaultTileStyle.addEventListener('change', syncTileState);
    tileRadius.addEventListener('input', updatePreview);
    tileDensity.addEventListener('change', updatePreview);
    showDescriptions.addEventListener('change', updatePreview);

    async function loadBranding() {
        const response = await fetch(OC.generateUrl('/apps/internal_links/branding'), { headers: { requesttoken: OC.requestToken } });
        if (!response.ok) throw new Error('Unable to load appearance settings.');
        const data = await response.json();

        displayName.value = data.displayName || 'Business Links';
        subtitle.value = data.subtitle || '';
        panelColor.value = normalizeColor(data.panelColor);
        panelColorText.value = panelColor.value;
        useDefaultColors.checked = data.useDefaultColors !== false;
        panelWidth.value = String(clamp(data.panelWidth, 700, 2400, 1280));
        panelHeight.value = String(clamp(data.panelHeight, 420, 1400, 560));
        useDefaultPanelSize.checked = data.useDefaultPanelSize !== false;

        const values = [
            [tileBackground, tileBackgroundText, data.tileBackground, '#ffffff'],
            [tileBorder, tileBorderText, data.tileBorder, '#c7c7c7'],
            [tileHoverBorder, tileHoverBorderText, data.tileHoverBorder, '#0082c9'],
            [iconBackground, iconBackgroundText, data.iconBackground, '#f2f2f2'],
        ];
        values.forEach(([picker, text, value, fallback]) => {
            const normalized = normalizeColor(value, fallback);
            picker.value = normalized;
            text.value = normalized;
        });
        tileRadius.value = String(clamp(data.tileRadius, 0, 32, 12));
        tileDensity.value = ['compact', 'comfortable', 'spacious'].includes(data.tileDensity) ? data.tileDensity : 'comfortable';
        showDescriptions.checked = data.showDescriptions !== false;
        useDefaultTileStyle.checked = data.useDefaultTileStyle !== false;

        syncColorState();
        syncSizeState();
        syncTileState();
    }

    saveButton.addEventListener('click', async () => {
        saveButton.disabled = true;
        message.textContent = 'Saving…';
        try {
            const response = await fetch(OC.generateUrl('/apps/internal_links/branding'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', requesttoken: OC.requestToken },
                body: JSON.stringify({
                    displayName: displayName.value.trim(),
                    subtitle: subtitle.value.trim(),
                    panelColor: normalizeColor(panelColorText.value),
                    useDefaultColors: useDefaultColors.checked,
                    panelWidth: clamp(panelWidth.value, 700, 2400, 1280),
                    panelHeight: clamp(panelHeight.value, 420, 1400, 560),
                    useDefaultPanelSize: useDefaultPanelSize.checked,
                    tileBackground: normalizeColor(tileBackgroundText.value),
                    tileBorder: normalizeColor(tileBorderText.value, '#c7c7c7'),
                    tileHoverBorder: normalizeColor(tileHoverBorderText.value, '#0082c9'),
                    iconBackground: normalizeColor(iconBackgroundText.value, '#f2f2f2'),
                    tileRadius: clamp(tileRadius.value, 0, 32, 12),
                    tileDensity: tileDensity.value,
                    showDescriptions: showDescriptions.checked,
                    useDefaultTileStyle: useDefaultTileStyle.checked,
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Unable to save appearance settings.');
            message.textContent = 'Appearance saved. Reload the launcher to apply the changes.';
            await loadBranding();
        } catch (error) {
            console.error(error);
            message.textContent = error.message;
        } finally {
            saveButton.disabled = false;
        }
    });

    try { await loadBranding(); } catch (error) { console.error(error); message.textContent = error.message; }
});
