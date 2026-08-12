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
            <div class="applications-toolbar-title">
                Applications
            </div>
            <div
                id="applications-count"
                class="applications-toolbar-count"
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
</div>