<?php

declare(strict_types=1);

namespace OCA\InternalLinks\Sections;

use OCP\IConfig;
use OCP\IURLGenerator;
use OCP\Settings\IIconSection;

class InternalLinksSection implements IIconSection
{
    public function __construct(
        private IURLGenerator $urlGenerator,
        private IConfig $config,
    ) {
    }

    public function getID(): string
    {
        return 'internal_links';
    }

    public function getName(): string
    {
        $name = trim($this->config->getAppValue('internal_links', 'display_name', 'Business Links'));
        return $name !== '' ? $name : 'Business Links';
    }

    public function getPriority(): int
    {
        return 50;
    }

    public function getIcon(): string
    {
        return $this->urlGenerator->imagePath(
            'internal_links',
            'app.svg'
        );
    }
}
