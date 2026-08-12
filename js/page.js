document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('applications-grid');
    const count = document.getElementById('applications-count');
    const search = document.getElementById('applications-search');
    const iconCache = new Map();

    if (!grid) {
        return;
    }

    function iconPath(icon) {
        return OC.filePath('internal_links', 'img', `icons/${icon}.svg`);
    }

    function safeIconName(icon) {
        const value = String(icon || 'activity');
        return /^[a-z0-9-]+$/.test(value) ? value : 'activity';
    }

    async function getIconSvg(iconName) {
        const safeName = safeIconName(iconName);

        if (!iconCache.has(safeName)) {
            iconCache.set(
                safeName,
                fetch(iconPath(safeName), { credentials: 'same-origin' })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Unable to load icon ${safeName}`);
                        }
                        return response.text();
                    })
                    .then(source => {
                        const documentSvg = new DOMParser().parseFromString(source, 'image/svg+xml');
                        const svg = documentSvg.documentElement;

                        if (!svg || svg.nodeName.toLowerCase() !== 'svg') {
                            throw new Error(`Invalid icon ${safeName}`);
                        }

                        svg.removeAttribute('class');
                        return svg;
                    })
            );
        }

        const svg = await iconCache.get(safeName);
        return svg.cloneNode(true);
    }

    async function renderIcon(container, iconName, className) {
        container.replaceChildren();

        try {
            const svg = await getIconSvg(iconName);
            svg.classList.add(className);
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('focusable', 'false');
            container.appendChild(svg);
        } catch (error) {
            console.warn('Internal Links icon:', error);
            const fallback = document.createElement('span');
            fallback.className = `${className} application-icon-fallback`;
            fallback.textContent = '•';
            fallback.setAttribute('aria-hidden', 'true');
            container.appendChild(fallback);
        }
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

        const searchText = [site.name, site.description, site.category]
            .map(value => String(value || '').toLocaleLowerCase())
            .join(' ');
        link.dataset.searchText = searchText;

        const descriptionText = String(site.description || '').trim();
        const accessibleName = descriptionText
            ? `Open ${site.name}: ${descriptionText} in a new tab`
            : `Open ${site.name} in a new tab`;
        link.setAttribute('aria-label', accessibleName);

        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'application-icon-wrapper';
        renderIcon(iconWrapper, site.icon || 'activity', 'application-icon');

        const title = document.createElement('div');
        title.className = 'application-title';
        title.textContent = site.name;

        const external = document.createElement('span');
        external.className = 'application-external';
        external.textContent = '↗';
        external.setAttribute('aria-hidden', 'true');

        link.append(external, iconWrapper, title);

        if (descriptionText) {
            const description = document.createElement('div');
            description.className = 'application-description';
            description.textContent = descriptionText;
            link.appendChild(description);
        }

        return link;
    }

    function createCategory(name) {
        const section = document.createElement('section');
        section.className = 'application-category';

        const heading = document.createElement('h2');
        heading.className = 'application-category-title';
        heading.textContent = name;

        const categoryGrid = document.createElement('div');
        categoryGrid.className = 'application-category-grid';

        section.append(heading, categoryGrid);
        return { section, categoryGrid };
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

        const categoryMap = new Map();
        const cards = [];

        sites.forEach(site => {
            const categoryName = String(site.category || '').trim() || 'Other';

            if (!categoryMap.has(categoryName)) {
                const category = createCategory(categoryName);
                categoryMap.set(categoryName, category);
                grid.appendChild(category.section);
            }

            const card = createApplicationCard(site);
            categoryMap.get(categoryName).categoryGrid.appendChild(card);
            cards.push(card);
        });

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

            categoryMap.forEach(({ section, categoryGrid }) => {
                const categoryHasVisibleCards = [...categoryGrid.querySelectorAll('.application-card')]
                    .some(card => !card.hidden);
                section.hidden = !categoryHasVisibleCards;
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
