<?php

declare(strict_types=1);

namespace OCA\InternalLinks\Controller;

use OCP\App\IAppManager;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IConfig;
use OCP\IRequest;

class PageController extends Controller
{
    private const APP_ID = 'internal_links';

    public function __construct(
        IRequest $request,
        private IAppManager $appManager,
        private IConfig $config,
    ) {
        parent::__construct(self::APP_ID, $request);
    }

    #[NoAdminRequired]
    #[NoCSRFRequired]
    public function index(): TemplateResponse
    {
        $displayName = trim($this->config->getAppValue(
            self::APP_ID,
            'display_name',
            'Business Links'
        ));

        if ($displayName === '') {
            $displayName = 'Business Links';
        }

        $panelColor = strtolower(trim($this->config->getAppValue(
            self::APP_ID,
            'panel_color',
            '#ffffff'
        )));

        if (!preg_match('/^#[0-9a-f]{6}$/', $panelColor)) {
            $panelColor = '#ffffff';
        }

        return new TemplateResponse(
            self::APP_ID,
            'index',
            [
                'version' => $this->appManager->getAppVersion(self::APP_ID),
                'displayName' => $displayName,
                'subtitle' => $this->config->getAppValue(
                    self::APP_ID,
                    'subtitle',
                    'Quick access to business services.'
                ),
                'panelColor' => $panelColor,
                'useDefaultColors' => $this->config->getAppValue(
                    self::APP_ID,
                    'use_default_colors',
                    '1'
                ) !== '0',
            ]
        );
    }
}
