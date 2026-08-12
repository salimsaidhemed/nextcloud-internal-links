<?php

declare(strict_types=1);

namespace OCA\InternalLinks\Settings;

use OCP\AppFramework\Http\TemplateResponse;
use OCP\Settings\ISettings;

class Admin implements ISettings
{
    public function getForm(): TemplateResponse
    {
        return new TemplateResponse(
            'internal_links',
            'admin'
        );
    }

    public function getSection(): string
    {
        return 'internal_links';
    }

    public function getPriority(): int
    {
        return 10;
    }
}