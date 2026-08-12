<?php

script('internal_links', 'admin');
style('internal_links', 'admin');

?>

<div id="internal-links-admin" class="section">

    <h2>Business Links</h2>

    <p class="settings-hint">
        Configure the launcher branding and the links shown to users.
    </p>

    <section class="internal-links-branding">
        <h3>Appearance</h3>

        <div class="branding-field">
            <label for="internal-links-display-name">Display name</label>
            <input
                id="internal-links-display-name"
                type="text"
                maxlength="60"
                placeholder="Business Links"
            >
            <p class="settings-hint">Shown in the top navigation, page title and footer.</p>
        </div>

        <div class="branding-field">
            <label for="internal-links-subtitle">Subtitle</label>
            <input
                id="internal-links-subtitle"
                type="text"
                maxlength="160"
                placeholder="Quick access to business services."
            >
            <p class="settings-hint">Optional text shown beneath the page title.</p>
        </div>
    </section>

    <h3>Links</h3>
    <div id="internal-links-sites"></div>

    <div class="internal-links-actions">
        <button
            id="internal-links-add"
            type="button"
            class="button"
        >
            Add Link
        </button>

        <button
            id="internal-links-save"
            type="button"
            class="button primary"
        >
            Save changes
        </button>
    </div>

    <div id="internal-links-message" aria-live="polite"></div>

</div>