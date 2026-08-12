<?php

declare(strict_types=1);

namespace OCA\InternalLinks\Sections;

use OCP\IL10N;
use OCP\IURLGenerator;
use OCP\Settings\IIconSection;

class InternalLinksSection implements IIconSection
{
    public function __construct(
        private IL10N $l10n,
        private IURLGenerator $urlGenerator,
    ) {
    }

    public function getID(): string
    {
        return 'internal_links';
    }

    public function getName(): string
    {
        return $this->l10n->t('Internal Links');
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