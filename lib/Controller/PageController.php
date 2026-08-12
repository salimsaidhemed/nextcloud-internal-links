<?php

declare(strict_types=1);

namespace OCA\InternalLinks\Controller;

use OCP\App\IAppManager;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IRequest;

class PageController extends Controller
{
    private const APP_ID = 'internal_links';

    public function __construct(
        IRequest $request,
        private IAppManager $appManager,
    ) {
        parent::__construct(self::APP_ID, $request);
    }

    #[NoAdminRequired]
    #[NoCSRFRequired]
    public function index(): TemplateResponse
    {
        return new TemplateResponse(
            self::APP_ID,
            'index',
            [
                'version' => $this->appManager->getAppVersion(self::APP_ID),
            ]
        );
    }
}
