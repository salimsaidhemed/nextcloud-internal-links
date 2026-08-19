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
    private const DEFAULT_PANEL_WIDTH = 1280;
    private const DEFAULT_PANEL_HEIGHT = 560;

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
        $displayName = trim($this->config->getAppValue(self::APP_ID, 'display_name', 'Business Links'));
        if ($displayName === '') {
            $displayName = 'Business Links';
        }

        $panelColor = $this->normalizeColor(
            $this->config->getAppValue(self::APP_ID, 'panel_color', '#ffffff'),
            '#ffffff'
        );

        $useDefaultPanelSize = $this->config->getAppValue(self::APP_ID, 'use_default_panel_size', '1') !== '0';
        $panelWidth = (int)$this->config->getAppValue(self::APP_ID, 'panel_width', (string)self::DEFAULT_PANEL_WIDTH);
        $panelHeight = (int)$this->config->getAppValue(self::APP_ID, 'panel_height', (string)self::DEFAULT_PANEL_HEIGHT);

        if ($useDefaultPanelSize) {
            $panelWidth = self::DEFAULT_PANEL_WIDTH;
            $panelHeight = self::DEFAULT_PANEL_HEIGHT;
        }

        $panelWidth = max(700, min($panelWidth, 2400));
        $panelHeight = max(420, min($panelHeight, 1400));

        $tileDensity = $this->config->getAppValue(self::APP_ID, 'tile_density', 'comfortable');
        if (!in_array($tileDensity, ['compact', 'comfortable', 'spacious'], true)) {
            $tileDensity = 'comfortable';
        }

        return new TemplateResponse(self::APP_ID, 'index', [
            'version' => $this->appManager->getAppVersion(self::APP_ID),
            'displayName' => $displayName,
            'subtitle' => $this->config->getAppValue(self::APP_ID, 'subtitle', 'Quick access to business services.'),
            'panelColor' => $panelColor,
            'useDefaultColors' => $this->config->getAppValue(self::APP_ID, 'use_default_colors', '1') !== '0',
            'panelWidth' => $panelWidth,
            'panelHeight' => $panelHeight,
            'useDefaultTileStyle' => $this->config->getAppValue(self::APP_ID, 'use_default_tile_style', '1') !== '0',
            'tileBackground' => $this->normalizeColor($this->config->getAppValue(self::APP_ID, 'tile_background', '#ffffff'), '#ffffff'),
            'tileBorder' => $this->normalizeColor($this->config->getAppValue(self::APP_ID, 'tile_border', '#c7c7c7'), '#c7c7c7'),
            'tileHoverBorder' => $this->normalizeColor($this->config->getAppValue(self::APP_ID, 'tile_hover_border', '#0082c9'), '#0082c9'),
            'iconBackground' => $this->normalizeColor($this->config->getAppValue(self::APP_ID, 'icon_background', '#f2f2f2'), '#f2f2f2'),
            'tileRadius' => max(0, min((int)$this->config->getAppValue(self::APP_ID, 'tile_radius', '12'), 32)),
            'tileDensity' => $tileDensity,
            'showDescriptions' => $this->config->getAppValue(self::APP_ID, 'show_descriptions', '1') !== '0',
        ]);
    }

    private function normalizeColor(string $value, string $fallback): string
    {
        $value = strtolower(trim($value));
        return preg_match('/^#[0-9a-f]{6}$/', $value) ? $value : $fallback;
    }
}
