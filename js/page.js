document.addEventListener('DOMContentLoaded', async () => {

    const grid = document.getElementById('applications-grid');
    const count = document.getElementById('applications-count');

    if (!grid) {
        return;
    }

    function iconPath(icon) {
        return OC.filePath(
            'internal_links',
            'img',
            `icons/${icon}.svg`
        );
    }

    try {

        const response = await fetch(
            OC.generateUrl('/apps/internal_links/sites'),
            {
                headers: {
                    requesttoken: OC.requestToken,
                }
            }
        );

        if (!response.ok) {
            throw new Error('Unable to load applications');
        }

        const data = await response.json();
        const sites = data.sites || [];

        if (count) {
            count.textContent =
            `${sites.length} ${sites.length === 1 ? 'item' : 'items'}`;
        }
        if (count) {
            count.textContent = 'Unavailable';
        }

        grid.innerHTML = '';

        if (sites.length === 0) {

            const empty = document.createElement('div');

            empty.className = 'applications-empty';

            empty.textContent =
                'No applications have been configured yet.';

            grid.appendChild(empty);

            return;
        }

        sites.forEach(site => {

            const link = document.createElement('a');

            link.className = 'application-card';
            link.href = site.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';

            const iconWrapper = document.createElement('div');

            iconWrapper.className =
                'application-icon-wrapper';

            const icon = document.createElement('img');

            icon.className = 'application-icon';

            icon.src = iconPath(
                site.icon || 'activity'
            );

            icon.alt = '';

            const title =
                document.createElement('div');

            title.className = 'application-title';

            title.textContent = site.name;

            const external =
                document.createElement('span');

            external.className =
                'application-external';

            external.textContent = '↗';

            iconWrapper.appendChild(icon);

            link.append(
                external,
                iconWrapper,
                title
            );

            grid.appendChild(link);
        });

    } catch (error) {

        console.error(
            'Internal Links:',
            error
        );

        grid.innerHTML = '';

        const errorMessage =
            document.createElement('div');

        errorMessage.className =
            'applications-error';

        errorMessage.textContent =
            'Unable to load applications.';

        grid.appendChild(errorMessage);
    }
});