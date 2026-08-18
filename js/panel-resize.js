document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('applications-window');
    const handle = document.getElementById('applications-resize-handle');
    const maximizeButton = document.getElementById('applications-maximize');
    const resetButton = document.getElementById('applications-reset-size');
    if (!panel || !handle) return;

    const STORAGE_WIDTH = 'internalLinksPanelWidth';
    const STORAGE_HEIGHT = 'internalLinksPanelHeight';
    const STORAGE_MAXIMIZED = 'internalLinksPanelMaximized';
    const MIN_WIDTH = 700;
    const MIN_HEIGHT = 420;

    const adminDefaultWidth = Number.parseInt(panel.dataset.defaultWidth || '1280', 10) || 1280;
    const adminDefaultHeight = Number.parseInt(panel.dataset.defaultHeight || '560', 10) || 560;

    let resizing = false;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;

    function maxDimensions() {
        return {
            width: Math.max(MIN_WIDTH, window.innerWidth - 32),
            height: Math.max(MIN_HEIGHT, window.innerHeight - 180),
        };
    }

    function clampDimensions(width, height) {
        const max = maxDimensions();
        return {
            width: Math.min(Math.max(width, MIN_WIDTH), max.width),
            height: Math.min(Math.max(height, MIN_HEIGHT), max.height),
        };
    }

    function applySize(width, height, persist = true) {
        const clamped = clampDimensions(width, height);
        panel.style.width = `${clamped.width}px`;
        panel.style.height = `${clamped.height}px`;
        panel.classList.remove('is-maximized');
        if (persist) {
            localStorage.setItem(STORAGE_WIDTH, String(Math.round(clamped.width)));
            localStorage.setItem(STORAGE_HEIGHT, String(Math.round(clamped.height)));
            localStorage.removeItem(STORAGE_MAXIMIZED);
        }
    }

    function maximize() {
        const max = maxDimensions();
        panel.classList.add('is-maximized');
        panel.style.width = `${max.width}px`;
        panel.style.height = `${max.height}px`;
        localStorage.setItem(STORAGE_MAXIMIZED, 'true');
    }

    function resetSize() {
        localStorage.removeItem(STORAGE_WIDTH);
        localStorage.removeItem(STORAGE_HEIGHT);
        localStorage.removeItem(STORAGE_MAXIMIZED);
        applySize(adminDefaultWidth, adminDefaultHeight, false);
    }

    const savedWidth = Number.parseInt(localStorage.getItem(STORAGE_WIDTH) || '', 10);
    const savedHeight = Number.parseInt(localStorage.getItem(STORAGE_HEIGHT) || '', 10);
    const savedMaximized = localStorage.getItem(STORAGE_MAXIMIZED) === 'true';

    if (savedMaximized) maximize();
    else if (Number.isFinite(savedWidth) && Number.isFinite(savedHeight)) applySize(savedWidth, savedHeight, false);
    else applySize(adminDefaultWidth, adminDefaultHeight, false);

    handle.addEventListener('pointerdown', event => {
        if (window.innerWidth <= 700) return;
        resizing = true;
        startX = event.clientX;
        startY = event.clientY;
        const rect = panel.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;
        handle.setPointerCapture(event.pointerId);
        document.body.classList.add('internal-links-resizing');
        event.preventDefault();
    });

    handle.addEventListener('pointermove', event => {
        if (!resizing) return;
        applySize(startWidth + (event.clientX - startX), startHeight + (event.clientY - startY), false);
    });

    function finishResize(event) {
        if (!resizing) return;
        resizing = false;
        document.body.classList.remove('internal-links-resizing');
        const rect = panel.getBoundingClientRect();
        applySize(rect.width, rect.height, true);
        if (event?.pointerId !== undefined && handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    }

    handle.addEventListener('pointerup', finishResize);
    handle.addEventListener('pointercancel', finishResize);

    maximizeButton?.addEventListener('click', () => {
        if (panel.classList.contains('is-maximized')) {
            const width = Number.parseInt(localStorage.getItem(STORAGE_WIDTH) || '', 10);
            const height = Number.parseInt(localStorage.getItem(STORAGE_HEIGHT) || '', 10);
            if (Number.isFinite(width) && Number.isFinite(height)) applySize(width, height, false);
            else resetSize();
            localStorage.removeItem(STORAGE_MAXIMIZED);
        } else maximize();
    });

    resetButton?.addEventListener('click', resetSize);

    window.addEventListener('resize', () => {
        if (window.innerWidth <= 700) {
            panel.style.width = '';
            panel.style.height = '';
            panel.classList.remove('is-maximized');
            return;
        }
        if (localStorage.getItem(STORAGE_MAXIMIZED) === 'true') {
            maximize();
            return;
        }
        const rect = panel.getBoundingClientRect();
        const clamped = clampDimensions(rect.width, rect.height);
        panel.style.width = `${clamped.width}px`;
        panel.style.height = `${clamped.height}px`;
    });
});
