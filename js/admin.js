document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('internal-links-sites');
    const addButton = document.getElementById('internal-links-add');
    const saveButton = document.getElementById('internal-links-save');
    const message = document.getElementById('internal-links-message');

    if (!container) {
        return;
    }

    const icons = [
        ['activity', 'Activity'],
        ['at-sign', 'At Sign'],
        ['clipboard', 'Clipboard'],
        ['edit', 'Edit'],
        ['inbox', 'Inbox'],
        ['link', 'Link'],
        ['paperclip', 'Paperclip'],
        ['send', 'Send'],
        ['mail', 'Mail'],
        ['money', 'Money'],
        ['versions', 'Versions'],
    ];

    function iconPath(icon) {
        return OC.filePath('internal_links', 'img', `icons/${icon}.svg`);
    }

    function moveRow(row, direction) {
        if (direction === 'up' && row.previousElementSibling) {
            container.insertBefore(row, row.previousElementSibling);
        }

        if (direction === 'down' && row.nextElementSibling) {
            container.insertBefore(row.nextElementSibling, row);
        }
    }

    function createRow(site = {}) {
        const row = document.createElement('div');
        row.className = 'internal-links-site';

        const preview = document.createElement('div');
        preview.className = 'site-icon-wrapper';

        const previewImage = document.createElement('img');
        previewImage.className = 'site-icon-preview';
        const selectedIcon = site.icon || 'activity';
        previewImage.src = iconPath(selectedIcon);
        preview.appendChild(previewImage);

        const fields = document.createElement('div');
        fields.className = 'site-fields';

        const name = document.createElement('input');
        name.type = 'text';
        name.className = 'site-name';
        name.placeholder = 'Application name';
        name.value = site.name || '';

        const url = document.createElement('input');
        url.type = 'url';
        url.className = 'site-url';
        url.placeholder = 'https://example.internal';
        url.value = site.url || '';

        const category = document.createElement('input');
        category.type = 'text';
        category.className = 'site-category';
        category.placeholder = 'Category (optional)';
        category.maxLength = 80;
        category.value = site.category || '';

        fields.append(name, url, category);

        const icon = document.createElement('select');
        icon.className = 'site-icon';

        icons.forEach(([value, label]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            option.selected = value === selectedIcon;
            icon.appendChild(option);
        });

        icon.addEventListener('change', () => {
            previewImage.src = iconPath(icon.value);
        });

        const actions = document.createElement('div');
        actions.className = 'site-row-actions';

        const up = document.createElement('button');
        up.type = 'button';
        up.className = 'site-order-button';
        up.textContent = '↑';
        up.title = 'Move up';
        up.setAttribute('aria-label', 'Move application up');
        up.addEventListener('click', () => moveRow(row, 'up'));

        const down = document.createElement('button');
        down.type = 'button';
        down.className = 'site-order-button';
        down.textContent = '↓';
        down.title = 'Move down';
        down.setAttribute('aria-label', 'Move application down');
        down.addEventListener('click', () => moveRow(row, 'down'));

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'internal-links-remove';
        remove.textContent = 'Remove';
        remove.addEventListener('click', () => row.remove());

        actions.append(up, down, remove);
        row.append(preview, fields, icon, actions);
        container.appendChild(row);
    }

    async function loadSites() {
        const response = await fetch(
            OC.generateUrl('/apps/internal_links/sites'),
            { headers: { requesttoken: OC.requestToken } }
        );

        if (!response.ok) {
            throw new Error('Unable to load applications.');
        }

        const data = await response.json();
        container.innerHTML = '';
        (data.sites || []).forEach(createRow);
    }

    addButton.addEventListener('click', () => createRow());

    saveButton.addEventListener('click', async () => {
        const sites = [];

        container.querySelectorAll('.internal-links-site').forEach(row => {
            const name = row.querySelector('.site-name').value.trim();
            const url = row.querySelector('.site-url').value.trim();
            const category = row.querySelector('.site-category').value.trim();
            const icon = row.querySelector('.site-icon').value;

            if (name && url) {
                sites.push({ name, url, icon, category });
            }
        });

        saveButton.disabled = true;
        message.textContent = 'Saving…';

        try {
            const response = await fetch(
                OC.generateUrl('/apps/internal_links/sites'),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        requesttoken: OC.requestToken,
                    },
                    body: JSON.stringify({ sites }),
                }
            );

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Unable to save.');
            }

            message.textContent = 'Changes saved.';
        } catch (error) {
            console.error(error);
            message.textContent = error.message;
        } finally {
            saveButton.disabled = false;
        }
    });

    try {
        await loadSites();
    } catch (error) {
        console.error(error);
        message.textContent = error.message;
    }
});
