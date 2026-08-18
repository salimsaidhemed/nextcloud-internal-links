<?php
script('internal_links', 'page');
script('internal_links', 'panel-resize');
style('internal_links', 'page');
style('internal_links', 'customization');

$useDefaultColors = (bool)($_['useDefaultColors'] ?? true);
$panelColor = (string)($_['panelColor'] ?? '#ffffff');
$panelClass = $useDefaultColors ? '' : ' custom-panel-color';
$panelStyle = $useDefaultColors ? '' : '--internal-links-panel-color: ' . $panelColor . ';';
?>

<div id="internal-links-app">
    <header class="applications-header">
        <div>
            <h1><?php p($_['displayName'] ?? 'Business Links'); ?></h1>
            <?php if (trim((string)($_['subtitle'] ?? '')) !== ''): ?>
                <p><?php p($_['subtitle']); ?></p>
            <?php endif; ?>
        </div>
    </header>

    <section id="applications-window" class="applications-window<?php p($panelClass); ?>"<?php if ($panelStyle !== ''): ?> style="<?php p($panelStyle); ?>"<?php endif; ?>>
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

            <div class="applications-toolbar-right">
                <div
                    id="applications-count"
                    class="applications-toolbar-count"
                    aria-live="polite"
                >
                    Loading…
                </div>

                <button
                    id="applications-maximize"
                    class="applications-toolbar-button"
                    type="button"
                    title="Maximize panel"
                    aria-label="Maximize panel"
                >
                    ⛶
                </button>

                <button
                    id="applications-reset-size"
                    class="applications-toolbar-button"
                    type="button"
                    title="Reset panel size"
                    aria-label="Reset panel size"
                >
                    ↺
                </button>
            </div>
        </div>

        <main id="applications-grid">
            <div class="applications-loading">
                Loading applications…
            </div>
        </main>

        <div
            id="applications-resize-handle"
            class="applications-resize-handle"
            role="separator"
            aria-label="Resize application panel"
            aria-orientation="horizontal"
        ></div>
    </section>

    <footer class="internal-links-footer">
        <span><?php p($_['displayName'] ?? 'Business Links'); ?></span>
        <span aria-hidden="true">·</span>
        <span>v<?php p($_['version'] ?? '0'); ?></span>
    </footer>
</div>
