<?php

script('internal_links', 'admin');
script('internal_links', 'branding-admin');
style('internal_links', 'admin');
style('internal_links', 'branding-admin');

?>

<div id="internal-links-admin" class="section">

    <h2><?php p($_['displayName'] ?? 'Business Links'); ?></h2>

    <p class="settings-hint">
        Configure the launcher branding and the links shown to users.
    </p>

    <section class="internal-links-branding">
        <h3>Appearance</h3>

        <div class="branding-field">
            <label for="internal-links-display-name">Display name</label>
            <input id="internal-links-display-name" type="text" maxlength="60" placeholder="Business Links">
            <p class="settings-hint">Shown in the top navigation, page title, settings section and footer.</p>
        </div>

        <div class="branding-field">
            <label for="internal-links-subtitle">Subtitle</label>
            <input id="internal-links-subtitle" type="text" maxlength="160" placeholder="Quick access to business services.">
            <p class="settings-hint">Optional text shown beneath the page title.</p>
        </div>

        <div class="branding-field branding-color-field">
            <label for="internal-links-panel-color">Panel color</label>
            <div class="branding-color-controls">
                <input id="internal-links-panel-color" type="color" value="#ffffff" aria-label="Panel color">
                <input id="internal-links-panel-color-text" type="text" value="#ffffff" maxlength="7" pattern="#[0-9A-Fa-f]{6}" aria-label="Panel color hexadecimal value">
            </div>
            <p class="settings-hint">Choose a custom background color for the applications panel.</p>
        </div>

        <div class="branding-field branding-switch-field">
            <label class="branding-switch-label" for="internal-links-default-colors">
                <input id="internal-links-default-colors" type="checkbox" checked>
                <span>Use default Nextcloud colors</span>
            </label>
            <p class="settings-hint">When enabled, the launcher follows the active Nextcloud light or dark theme.</p>
        </div>

        <div class="branding-field">
            <label>Default panel size</label>
            <div class="branding-size-controls">
                <label for="internal-links-panel-width">Width</label>
                <input id="internal-links-panel-width" type="number" min="700" max="2400" step="10" value="1280">
                <span>px</span>
                <label for="internal-links-panel-height">Height</label>
                <input id="internal-links-panel-height" type="number" min="420" max="1400" step="10" value="560">
                <span>px</span>
            </div>
            <p class="settings-hint">This is the size users get before they create a personal resized layout.</p>
        </div>

        <div class="branding-field branding-switch-field">
            <label class="branding-switch-label" for="internal-links-default-panel-size">
                <input id="internal-links-default-panel-size" type="checkbox" checked>
                <span>Use built-in default panel size</span>
            </label>
            <p class="settings-hint">When enabled, the default size is 1280 × 560 px. Disable it to set a custom default size.</p>
        </div>

        <div class="branding-actions">
            <button id="internal-links-branding-save" type="button" class="button primary">Save appearance</button>
            <span id="internal-links-branding-message" aria-live="polite"></span>
        </div>
    </section>

    <h3>Links</h3>
    <div id="internal-links-sites"></div>

    <div class="internal-links-actions">
        <button id="internal-links-add" type="button" class="button">Add Link</button>
        <button id="internal-links-save" type="button" class="button primary">Save changes</button>
    </div>

    <div id="internal-links-message" aria-live="polite"></div>

</div>