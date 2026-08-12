document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('applications-grid');
    const count = document.getElementById('applications-count');
    const search = document.getElementById('applications-search');

    if (!grid) {
        return;
    }

    function iconPath(icon) {
        return OC.filePath('internal_links', 'img', `icons/${icon}.svg`);
    }

    function setCount(visible, total) {
        if (!count) {
            return;
        }

        if (visible === total) {
            count.textContent = `${total} ${total === 1 ? 'item' : 'items'}`;
            return;
        }

        count.textContent = `${visible} of ${total}`;
    }

    function createState(className, title, message) {
        const state = document.createElement('div');
        state.className = className;

        const strong = document.createElement('strong');
        strong.textContent = title;

        const span = document.createElement('span');
        span.textContent = message;

        state.append(strong, span);
        return state;
    }

    function createApplicationCard(site) {
        const link = document.createElement('a');
        link.className = 'application-card';
        link.href = site.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.dataset.searchText = String(site.name || '').toLocaleLowerCase();
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

        return link;
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

        grid.innerHTML = '';

        if (sites.length === 0) {
            setCount(0, 0);
            grid.appendChild(
                createState(
                    'applications-empty',
                    'No links yet',
                    'Add applications from Administration settings → Internal Links.'
                )
            );
            if (search) {
                search.disabled = true;
            }
            return;
        }

        const cards = sites.map(createApplicationCard);
        cards.forEach(card => grid.appendChild(card));
        setCount(cards.length, cards.length);

        function applyFilter() {
            const query = search ? search.value.trim().toLocaleLowerCase() : '';
            let visible = 0;

            cards.forEach(card => {
                const matches = query === '' || card.dataset.searchText.includes(query);
                card.hidden = !matches;
                if (matches) {
                    visible += 1;
                }
            });

            const existingNoResults = grid.querySelector('.applications-no-results');
            if (existingNoResults) {
                existingNoResults.remove();
            }

            if (visible === 0 && query !== '') {
                grid.appendChild(
                    createState(
                        'applications-no-results',
                        'No matching applications',
                        `No applications match “${search.value.trim()}”.`
                    )
                );
            }

            setCount(visible, cards.length);
        }

        if (search) {
            search.addEventListener('input', applyFilter);
            search.addEventListener('keydown', event => {
                if (event.key === 'Escape' && search.value !== '') {
                    search.value = '';
                    applyFilter();
                    search.blur();
                }
            });

            document.addEventListener('keydown', event => {
                const target = event.target;
                const isTyping = target instanceof HTMLInputElement
                    || target instanceof HTMLTextAreaElement
                    || target?.isContentEditable;

                if (event.key === '/' && !isTyping) {
                    event.preventDefault();
                    search.focus();
                }
            });
        }
    } catch (error) {
        console.error('Internal Links:', error);
        if (count) {
            count.textContent = 'Unavailable';
        }
        if (search) {
            search.disabled = true;
        }
        grid.innerHTML = '';
        grid.appendChild(
            createState(
                'applications-error',
                'Applications could not be loaded',
                'Refresh the page or contact your Nextcloud administrator.'
            )
        );
    }
});
