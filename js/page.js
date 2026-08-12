document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('applications-grid');
    const count = document.getElementById('applications-count');

    if (!grid) {
        return;
    }

    function iconPath(icon) {
        return OC.filePath('internal_links', 'img', `icons/${icon}.svg`);
    }

    function setCount(value) {
        if (count) {
            count.textContent = value;
        }
    }

    try {
        const response = await fetch(
            OC.generateUrl('/apps/internal_links/sites'),
            {
                headers: {
                    requesttoken: OC.requestToken,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Unable to load applications (HTTP ${response.status})`);
        }

        const data = await response.json();
        const sites = Array.isArray(data.sites) ? data.sites : [];

        setCount(`${sites.length} ${sites.length === 1 ? 'item' : 'items'}`);
        grid.innerHTML = '';

        if (sites.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'applications-empty';
            empty.innerHTML = '<strong>No links yet</strong><span>Add applications from Administration settings → Internal Links.</span>';
            grid.appendChild(empty);
            return;
        }

        sites.forEach(site => {
            const link = document.createElement('a');
            link.className = 'application-card';
            link.href = site.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.setAttribute('aria-label', `Open ${site.name} in a new tab`);

            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'application-icon-wrapper';

            const icon = document.createElement('img');
            icon.className = 'application-icon';
            icon.src = iconPath(site.icon || 'activity');
            icon.alt = '';
            icon.setAttribute('aria-hidden', 'true');

            const title = document.createElement('div');
            title.className = 'application-title';
            title.textContent = site.name;

            const external = document.createElement('span');
            external.className = 'application-external';
            external.textContent = '↗';
            external.setAttribute('aria-hidden', 'true');

            iconWrapper.appendChild(icon);
            link.append(external, iconWrapper, title);
            grid.appendChild(link);
        });
    } catch (error) {
        console.error('Internal Links:', error);
        setCount('Unavailable');
        grid.innerHTML = '';

        const errorMessage = document.createElement('div');
        errorMessage.className = 'applications-error';
        errorMessage.innerHTML = '<strong>Applications could not be loaded</strong><span>Refresh the page or contact your Nextcloud administrator.</span>';
        grid.appendChild(errorMessage);
    }
});
