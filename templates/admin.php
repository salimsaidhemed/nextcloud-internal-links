<?php

script('internal_links', 'admin');
script('internal_links', 'branding-admin');
style('internal_links', 'admin');
style('internal_links', 'branding-admin');

?>

<div id="internal-links-admin" class="section">
    <h2><?php p($_['displayName'] ?? 'Business Links'); ?></h2>
    <p class="settings-hint">Configure the launcher branding and the links shown to users.</p>

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
        </div>

        <div class="branding-field branding-switch-field">
            <label class="branding-switch-label" for="internal-links-default-panel-size">
                <input id="internal-links-default-panel-size" type="checkbox" checked>
                <span>Use built-in default panel size</span>
            </label>
        </div>

        <hr class="branding-divider">
        <h3>Tile appearance</h3>

        <div class="branding-field branding-switch-field">
            <label class="branding-switch-label" for="internal-links-default-tile-style">
                <input id="internal-links-default-tile-style" type="checkbox" checked>
                <span>Use default tile styling</span>
            </label>
            <p class="settings-hint">When enabled, tile colors and borders follow the standard Nextcloud-aware design.</p>
        </div>

        <div id="internal-links-tile-style-fields">
            <div class="branding-color-grid">
                <div class="branding-field branding-color-field">
                    <label for="internal-links-tile-background">Tile background</label>
                    <div class="branding-color-controls"><input id="internal-links-tile-background" type="color" value="#ffffff"><input id="internal-links-tile-background-text" type="text" value="#ffffff" maxlength="7"></div>
                </div>
                <div class="branding-field branding-color-field">
                    <label for="internal-links-tile-border">Tile border</label>
                    <div class="branding-color-controls"><input id="internal-links-tile-border" type="color" value="#c7c7c7"><input id="internal-links-tile-border-text" type="text" value="#c7c7c7" maxlength="7"></div>
                </div>
                <div class="branding-field branding-color-field">
                    <label for="internal-links-tile-hover-border">Hover / accent border</label>
                    <div class="branding-color-controls"><input id="internal-links-tile-hover-border" type="color" value="#0082c9"><input id="internal-links-tile-hover-border-text" type="text" value="#0082c9" maxlength="7"></div>
                </div>
                <div class="branding-field branding-color-field">
                    <label for="internal-links-icon-background">Icon background</label>
                    <div class="branding-color-controls"><input id="internal-links-icon-background" type="color" value="#f2f2f2"><input id="internal-links-icon-background-text" type="text" value="#f2f2f2" maxlength="7"></div>
                </div>
            </div>

            <div class="branding-field">
                <label for="internal-links-tile-radius">Corner radius</label>
                <div class="branding-inline-control"><input id="internal-links-tile-radius" type="number" min="0" max="32" step="1" value="12"><span>px</span></div>
            </div>
        </div>

        <div class="branding-field">
            <label for="internal-links-tile-density">Tile density</label>
            <select id="internal-links-tile-density">
                <option value="compact">Compact</option>
                <option value="comfortable" selected>Comfortable</option>
                <option value="spacious">Spacious</option>
            </select>
            <p class="settings-hint">Controls how many applications fit in the launcher at once.</p>
        </div>

        <div class="branding-field branding-switch-field">
            <label class="branding-switch-label" for="internal-links-show-descriptions">
                <input id="internal-links-show-descriptions" type="checkbox" checked>
                <span>Show application descriptions</span>
            </label>
        </div>

        <div class="tile-preview-wrap">
            <span class="settings-hint">Preview</span>
            <div id="internal-links-tile-preview" class="tile-preview-card">
                <div class="tile-preview-icon">⌂</div>
                <strong>Business App</strong>
                <small>Example application description</small>
            </div>
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