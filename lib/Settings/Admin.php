<?php

declare(strict_types=1);

namespace OCA\InternalLinks\Settings;

use OCP\AppFramework\Http\TemplateResponse;
use OCP\IConfig;
use OCP\Settings\ISettings;

class Admin implements ISettings
{
    public function __construct(
        private IConfig $config,
    ) {
    }

    public function getForm(): TemplateResponse
    {
        $displayName = trim($this->config->getAppValue(
            'internal_links',
            'display_name',
            'Business Links'
        ));

        if ($displayName === '') {
            $displayName = 'Business Links';
        }

        return new TemplateResponse(
            'internal_links',
            'admin',
            ['displayName' => $displayName]
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
