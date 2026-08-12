<?php

declare(strict_types=1);

namespace OCA\InternalLinks\AppInfo;

use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\INavigationManager;
use OCP\IURLGenerator;

class Application extends App implements IBootstrap
{
    public const APP_ID = 'internal_links';

    public function __construct(array $urlParams = [])
    {
        parent::__construct(self::APP_ID, $urlParams);
    }

    public function register(IRegistrationContext $context): void
    {
    }

    public function boot(IBootContext $context): void
    {
        $serverContainer = $context->getServerContainer();

        $navigationManager = $serverContainer->get(INavigationManager::class);
        $urlGenerator = $serverContainer->get(IURLGenerator::class);

        $navigationManager->add(function () use (
            $urlGenerator
        ): array {
            return [
                'id' => self::APP_ID,

                'order' => 20,

                'href' => $urlGenerator->linkToRoute(
                    'internal_links.page.index'
                ),

                'icon' => $urlGenerator->imagePath(
                    self::APP_ID,
                    'app.svg'
                ),

                'name' => 'Internal Links ',
            ];
        });
    }
}