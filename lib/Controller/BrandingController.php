<?php

declare(strict_types=1);

namespace OCA\InternalLinks\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IConfig;
use OCP\IRequest;

class BrandingController extends Controller
{
    private const APP_ID = 'internal_links';
    private const DEFAULT_NAME = 'Business Links';
    private const DEFAULT_SUBTITLE = 'Quick access to business services.';

    public function __construct(
        IRequest $request,
        private IConfig $config,
    ) {
        parent::__construct(self::APP_ID, $request);
    }

    public function index(): JSONResponse
    {
        return new JSONResponse([
            'displayName' => $this->config->getAppValue(self::APP_ID, 'display_name', self::DEFAULT_NAME),
            'subtitle' => $this->config->getAppValue(self::APP_ID, 'subtitle', self::DEFAULT_SUBTITLE),
        ]);
    }

    public function save(string $displayName = '', string $subtitle = ''): JSONResponse
    {
        $displayName = trim($displayName);
        $subtitle = trim($subtitle);

        if ($displayName === '') {
            $displayName = self::DEFAULT_NAME;
        }

        if (mb_strlen($displayName) > 60) {
            $displayName = mb_substr($displayName, 0, 60);
        }

        if (mb_strlen($subtitle) > 160) {
            $subtitle = mb_substr($subtitle, 0, 160);
        }

        $this->config->setAppValue(self::APP_ID, 'display_name', $displayName);
        $this->config->setAppValue(self::APP_ID, 'subtitle', $subtitle);

        return new JSONResponse([
            'success' => true,
            'displayName' => $displayName,
            'subtitle' => $subtitle,
        ]);
    }
}
