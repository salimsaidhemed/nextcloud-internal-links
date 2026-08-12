<?php
script('internal_links', 'page');
style('internal_links', 'page');
?>

<div id="internal-links-app">
    <header class="applications-header">
        <div>
            <h1>Internal Links</h1>
            <p>Quick access to internal and business services.</p>
        </div>
    </header>

    <section class="applications-window">
        <div class="applications-toolbar">
            <div class="applications-toolbar-title">Applications</div>

            <div class="applications-toolbar-search">
                <label class="visually-hidden" for="applications-search">Search applications</label>
                <input
                    id="applications-search"
                    class="applications-search-input"
                    type="search"
                    placeholder="Search applications"
                    autocomplete="off"
                    spellcheck="false"
                >
            </div>

            <div
                id="applications-count"
                class="applications-toolbar-count"
                aria-live="polite"
            >
                Loading…
            </div>
        </div>

        <main id="applications-grid">
            <div class="applications-loading">
                Loading applications…
            </div>
        </main>
    </section>

    <footer class="internal-links-footer">
        <span>Internal Links</span>
        <span aria-hidden="true">·</span>
        <span>v<?php p($_['version'] ?? '0'); ?></span>
    </footer>
</div>
