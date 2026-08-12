<?php

declare(strict_types=1);

namespace OCA\InternalLinks\AppInfo;

use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\IConfig;
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
        $config = $serverContainer->get(IConfig::class);

        $navigationManager->add(function () use ($urlGenerator, $config): array {
            $displayName = trim($config->getAppValue(
                self::APP_ID,
                'display_name',
                'Business Links'
            ));

            if ($displayName === '') {
                $displayName = 'Business Links';
            }

            return [
                'id' => self::APP_ID,
                'order' => 20,
                'href' => $urlGenerator->linkToRoute('internal_links.page.index'),
                'icon' => $urlGenerator->imagePath(self::APP_ID, 'app-nav.svg'),
                'name' => $displayName,
            ];
        });
    }
}
