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
    ): JSONResponse {
        $displayName = trim($displayName);
        $subtitle = trim($subtitle);
        $panelColor = strtolower(trim($panelColor));

        if ($displayName === '') {
            $displayName = self::DEFAULT_NAME;
        }

        if (mb_strlen($displayName) > 60) {
            $displayName = mb_substr($displayName, 0, 60);
        }

        if (mb_strlen($subtitle) > 160) {
            $subtitle = mb_substr($subtitle, 0, 160);
        }

        if (!preg_match('/^#[0-9a-f]{6}$/', $panelColor)) {
            $panelColor = self::DEFAULT_PANEL_COLOR;
        }

        $panelWidth = max(700, min($panelWidth, 2400));
        $panelHeight = max(420, min($panelHeight, 1400));

        if ($useDefaultPanelSize) {
            $panelWidth = self::DEFAULT_PANEL_WIDTH;
            $panelHeight = self::DEFAULT_PANEL_HEIGHT;
        }

        $this->config->setAppValue(self::APP_ID, 'display_name', $displayName);
        $this->config->setAppValue(self::APP_ID, 'subtitle', $subtitle);
        $this->config->setAppValue(self::APP_ID, 'panel_color', $panelColor);
        $this->config->setAppValue(self::APP_ID, 'use_default_colors', $useDefaultColors ? '1' : '0');
        $this->config->setAppValue(self::APP_ID, 'panel_width', (string)$panelWidth);
        $this->config->setAppValue(self::APP_ID, 'panel_height', (string)$panelHeight);
        $this->config->setAppValue(self::APP_ID, 'use_default_panel_size', $useDefaultPanelSize ? '1' : '0');

        return new JSONResponse([
            'success' => true,
            'displayName' => $displayName,
            'subtitle' => $subtitle,
            'panelColor' => $panelColor,
            'useDefaultColors' => $useDefaultColors,
            'panelWidth' => $panelWidth,
            'panelHeight' => $panelHeight,
            'useDefaultPanelSize' => $useDefaultPanelSize,
        ]);
    }
}
