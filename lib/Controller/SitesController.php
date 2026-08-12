<?php

declare(strict_types=1);

namespace OCA\InternalLinks\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IConfig;
use OCP\IRequest;

class SitesController extends Controller
{
    private const APP_ID = 'internal_links';

    private const ALLOWED_ICONS = [
        'activity',
        'at-sign',
        'clipboard',
        'edit',
        'inbox',
        'link',
        'paperclip',
        'send',
        'mail',
        'money',
        'versions',
    ];

    public function __construct(
        IRequest $request,
        private IConfig $config,
    ) {
        parent::__construct(self::APP_ID, $request);
    }

    #[NoAdminRequired]
    public function index(): JSONResponse
    {
        $json = $this->config->getAppValue(
            self::APP_ID,
            'sites',
            '[]'
        );

        $sites = json_decode($json, true);

        if (!is_array($sites)) {
            $sites = [];
        }

        return new JSONResponse([
            'sites' => $sites,
        ]);
    }

    public function save(array $sites): JSONResponse
    {
        $cleanSites = [];

        foreach ($sites as $site) {
            $name = trim((string)($site['name'] ?? ''));
            $url = trim((string)($site['url'] ?? ''));
            $icon = trim((string)($site['icon'] ?? 'activity'));

            if ($name === '' || $url === '') {
                continue;
            }

            if (!filter_var($url, FILTER_VALIDATE_URL)) {
                return new JSONResponse([
                    'success' => false,
                    'message' => "Invalid URL for {$name}",
                ], 400);
            }

            if (!in_array($icon, self::ALLOWED_ICONS, true)) {
                $icon = 'activity';
            }

            $cleanSites[] = [
                'name' => $name,
                'url' => $url,
                'icon' => $icon,
            ];
        }

        $this->config->setAppValue(
            self::APP_ID,
            'sites',
            json_encode(
                $cleanSites,
                JSON_UNESCAPED_SLASHES
            )
        );

        return new JSONResponse([
            'success' => true,
            'sites' => $cleanSites,
        ]);
    }
}