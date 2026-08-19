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
    private const DEFAULT_PANEL_COLOR = '#ffffff';
    private const DEFAULT_PANEL_WIDTH = 1280;
    private const DEFAULT_PANEL_HEIGHT = 560;
    private const DEFAULT_TILE_BACKGROUND = '#ffffff';
    private const DEFAULT_TILE_BORDER = '#c7c7c7';
    private const DEFAULT_TILE_HOVER_BORDER = '#0082c9';
    private const DEFAULT_ICON_BACKGROUND = '#f2f2f2';
    private const DEFAULT_TILE_RADIUS = 12;
    private const DEFAULT_TILE_DENSITY = 'comfortable';

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
            'panelColor' => $this->config->getAppValue(self::APP_ID, 'panel_color', self::DEFAULT_PANEL_COLOR),
            'useDefaultColors' => $this->config->getAppValue(self::APP_ID, 'use_default_colors', '1') !== '0',
            'panelWidth' => (int)$this->config->getAppValue(self::APP_ID, 'panel_width', (string)self::DEFAULT_PANEL_WIDTH),
            'panelHeight' => (int)$this->config->getAppValue(self::APP_ID, 'panel_height', (string)self::DEFAULT_PANEL_HEIGHT),
            'useDefaultPanelSize' => $this->config->getAppValue(self::APP_ID, 'use_default_panel_size', '1') !== '0',
            'tileBackground' => $this->config->getAppValue(self::APP_ID, 'tile_background', self::DEFAULT_TILE_BACKGROUND),
            'tileBorder' => $this->config->getAppValue(self::APP_ID, 'tile_border', self::DEFAULT_TILE_BORDER),
            'tileHoverBorder' => $this->config->getAppValue(self::APP_ID, 'tile_hover_border', self::DEFAULT_TILE_HOVER_BORDER),
            'iconBackground' => $this->config->getAppValue(self::APP_ID, 'icon_background', self::DEFAULT_ICON_BACKGROUND),
            'tileRadius' => (int)$this->config->getAppValue(self::APP_ID, 'tile_radius', (string)self::DEFAULT_TILE_RADIUS),
            'tileDensity' => $this->config->getAppValue(self::APP_ID, 'tile_density', self::DEFAULT_TILE_DENSITY),
            'showDescriptions' => $this->config->getAppValue(self::APP_ID, 'show_descriptions', '1') !== '0',
            'useDefaultTileStyle' => $this->config->getAppValue(self::APP_ID, 'use_default_tile_style', '1') !== '0',
        ]);
    }

    public function save(
        string $displayName = '',
        string $subtitle = '',
        string $panelColor = self::DEFAULT_PANEL_COLOR,
        bool $useDefaultColors = true,
        int $panelWidth = self::DEFAULT_PANEL_WIDTH,
        int $panelHeight = self::DEFAULT_PANEL_HEIGHT,
        bool $useDefaultPanelSize = true,
        string $tileBackground = self::DEFAULT_TILE_BACKGROUND,
        string $tileBorder = self::DEFAULT_TILE_BORDER,
        string $tileHoverBorder = self::DEFAULT_TILE_HOVER_BORDER,
        string $iconBackground = self::DEFAULT_ICON_BACKGROUND,
        int $tileRadius = self::DEFAULT_TILE_RADIUS,
        string $tileDensity = self::DEFAULT_TILE_DENSITY,
        bool $showDescriptions = true,
        bool $useDefaultTileStyle = true,
    ): JSONResponse {
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

        $panelColor = $this->normalizeColor($panelColor, self::DEFAULT_PANEL_COLOR);
        $tileBackground = $this->normalizeColor($tileBackground, self::DEFAULT_TILE_BACKGROUND);
        $tileBorder = $this->normalizeColor($tileBorder, self::DEFAULT_TILE_BORDER);
        $tileHoverBorder = $this->normalizeColor($tileHoverBorder, self::DEFAULT_TILE_HOVER_BORDER);
        $iconBackground = $this->normalizeColor($iconBackground, self::DEFAULT_ICON_BACKGROUND);

        $panelWidth = max(700, min($panelWidth, 2400));
        $panelHeight = max(420, min($panelHeight, 1400));
        $tileRadius = max(0, min($tileRadius, 32));
        $tileDensity = in_array($tileDensity, ['compact', 'comfortable', 'spacious'], true)
            ? $tileDensity
            : self::DEFAULT_TILE_DENSITY;

        if ($useDefaultPanelSize) {
            $panelWidth = self::DEFAULT_PANEL_WIDTH;
            $panelHeight = self::DEFAULT_PANEL_HEIGHT;
        }

        if ($useDefaultTileStyle) {
            $tileBackground = self::DEFAULT_TILE_BACKGROUND;
            $tileBorder = self::DEFAULT_TILE_BORDER;
            $tileHoverBorder = self::DEFAULT_TILE_HOVER_BORDER;
            $iconBackground = self::DEFAULT_ICON_BACKGROUND;
            $tileRadius = self::DEFAULT_TILE_RADIUS;
        }

        $values = [
            'display_name' => $displayName,
            'subtitle' => $subtitle,
            'panel_color' => $panelColor,
            'use_default_colors' => $useDefaultColors ? '1' : '0',
            'panel_width' => (string)$panelWidth,
            'panel_height' => (string)$panelHeight,
            'use_default_panel_size' => $useDefaultPanelSize ? '1' : '0',
            'tile_background' => $tileBackground,
            'tile_border' => $tileBorder,
            'tile_hover_border' => $tileHoverBorder,
            'icon_background' => $iconBackground,
            'tile_radius' => (string)$tileRadius,
            'tile_density' => $tileDensity,
            'show_descriptions' => $showDescriptions ? '1' : '0',
            'use_default_tile_style' => $useDefaultTileStyle ? '1' : '0',
        ];

        foreach ($values as $key => $value) {
            $this->config->setAppValue(self::APP_ID, $key, $value);
        }

        return new JSONResponse([
            'success' => true,
            'displayName' => $displayName,
            'subtitle' => $subtitle,
            'panelColor' => $panelColor,
            'useDefaultColors' => $useDefaultColors,
            'panelWidth' => $panelWidth,
            'panelHeight' => $panelHeight,
            'useDefaultPanelSize' => $useDefaultPanelSize,
            'tileBackground' => $tileBackground,
            'tileBorder' => $tileBorder,
            'tileHoverBorder' => $tileHoverBorder,
            'iconBackground' => $iconBackground,
            'tileRadius' => $tileRadius,
            'tileDensity' => $tileDensity,
            'showDescriptions' => $showDescriptions,
            'useDefaultTileStyle' => $useDefaultTileStyle,
        ]);
    }

    private function normalizeColor(string $value, string $fallback): string
    {
        $value = strtolower(trim($value));
        return preg_match('/^#[0-9a-f]{6}$/', $value) ? $value : $fallback;
    }
}
