# Internal Links for Nextcloud

A configurable application launcher for Nextcloud that provides users with quick access to internal systems, business applications, and external services from a dedicated Nextcloud page.

The app is designed to provide a simple, modern alternative to maintaining hard-coded links in the Nextcloud dashboard.

## Features

- Dedicated **Internal Links** page inside Nextcloud
- Integration with the Nextcloud application navigation
- Administration interface for managing links
- Add and remove applications without modifying source code
- Configurable application icons
- Links open safely in a new browser tab
- Responsive application launcher interface
- Uses Nextcloud theme variables for theme compatibility
- Configuration stored using Nextcloud AppConfig
- No external frontend dependencies

## Screenshots

Screenshots will be added as the interface develops.

## Requirements

- Nextcloud 31
- PHP version supported by Nextcloud 31
- Administrator access for configuration

Development and testing currently target:

```text
Nextcloud 31.x
Docker / Docker Compose
MariaDB 11
Apache
```

## Installation

Clone or extract the application into the Nextcloud `custom_apps` directory:

```bash
cd /var/www/nextcloud/custom_apps

git clone https://github.com/salimsaidhemed/nextcloud-internal-links.git internal_links
```

Ensure the directory is readable by the web server:

```bash
chown -R www-data:www-data internal_links
```

Enable the application:

```bash
cd /var/www/nextcloud

sudo -u www-data php occ app:enable internal_links
```

The **Internal Links** application should then appear in the Nextcloud application navigation.

## Configuration

Administrators can manage links from:

```text
Administration settings
    └── Internal Links
```

Each application currently consists of:

| Field | Description |
|---|---|
| Name | User-facing application name |
| URL | Destination URL |
| Icon | Icon displayed in the launcher |

Example configuration:

```json
[
  {
    "name": "Payroll",
    "url": "https://payroll.example.internal",
    "icon": "money"
  },
  {
    "name": "Document Versions",
    "url": "https://versions.example.internal",
    "icon": "versions"
  }
]
```

Configuration is stored using Nextcloud AppConfig rather than in application source files.

It can be inspected from the command line with:

```bash
sudo -u www-data php occ config:app:get internal_links sites
```

## Available Icons

The application currently ships with the following icons:

```text
activity
edit
inbox
mail
money
versions
```

SVG assets are located under:

```text
img/icons/
```

Additional icons can be added as the application evolves.

## Architecture

The application follows the standard Nextcloud App Framework structure.

```text
internal_links/
├── appinfo/
│   ├── info.xml
│   └── routes.php
│
├── lib/
│   ├── AppInfo/
│   │   └── Application.php
│   │
│   ├── Controller/
│   │   ├── PageController.php
│   │   └── SitesController.php
│   │
│   ├── Sections/
│   │   └── InternalLinksSection.php
│   │
│   └── Settings/
│       └── Admin.php
│
├── templates/
│   ├── index.php
│   └── admin.php
│
├── js/
│   ├── page.js
│   └── admin.js
│
├── css/
│   ├── page.css
│   └── admin.css
│
├── img/
│   ├── app.svg
│   └── icons/
│
├── README.md
├── CHANGELOG.md
├── LICENSE
└── .gitignore
```

### Application flow

```text
                     Nextcloud
                         │
                  Internal Links
                         │
                         ▼
                  PageController
                         │
                         ▼
                    index.php
                         │
                    page.js
                         │
                         ▼
                 GET /sites API
                         │
                         ▼
                 SitesController
                         │
                         ▼
                   AppConfig
```

Administration follows a similar flow:

```text
Administration Settings
          │
          ▼
       Admin.php
          │
          ▼
      admin.php
          │
      admin.js
          │
          ▼
     POST /sites
          │
          ▼
   SitesController
          │
          ▼
      AppConfig
```

## Security

The application follows Nextcloud's standard authentication and CSRF protections.

The main application page is available to authenticated Nextcloud users.

Configuration changes are restricted to administrators.

State-changing requests remain protected by Nextcloud CSRF validation.

External links are opened using:

```html
target="_blank"
rel="noopener noreferrer"
```

The application does not proxy, embed, or retrieve content from configured destinations. It acts only as a launcher.

## Development

Development is performed against a local Dockerized Nextcloud environment.

Recommended directory layout:

```text
nextcloud-dev/
├── docker-compose.yml
└── internal_links/
```

The repository is bind-mounted into the Nextcloud container:

```yaml
volumes:
  - ./internal_links:/var/www/html/custom_apps/internal_links
```

This allows source files to be edited locally while Nextcloud runs inside Docker.

Start the development environment:

```bash
docker compose up -d
```

Enable the application:

```bash
docker compose exec -u www-data nextcloud \
  php occ app:enable internal_links
```

### Debugging

Enable Nextcloud debug mode:

```bash
docker compose exec -u www-data nextcloud \
  php occ config:system:set debug \
  --type=boolean \
  --value=true
```

Follow the Nextcloud log:

```bash
docker compose exec -u www-data nextcloud \
  php occ log:tail
```

PHP files can be checked before testing:

```bash
docker compose exec nextcloud sh -c '
find /var/www/html/custom_apps/internal_links \
-name "*.php" \
-exec php -l {} \;
'
```

### Frontend development

Nextcloud/browser caching may prevent updated JavaScript or CSS from appearing immediately.

During development:

1. Enable Nextcloud debug mode.
2. Disable browser caching in developer tools when necessary.
3. Perform a hard refresh after frontend changes.

On macOS:

```text
Command + Shift + R
```

## Development Guidelines

Changes should preserve the following principles:

- Maintain compatibility with Nextcloud 31.
- Follow Nextcloud App Framework conventions.
- Avoid modifying Nextcloud core files.
- Avoid external CDN dependencies.
- Keep configuration out of source code.
- Preserve CSRF protection for state-changing operations.
- Use Nextcloud CSS/theme variables where possible.
- Keep the UI responsive.
- Maintain keyboard accessibility.
- Do not hard-code customer-specific URLs.
- External applications should open in a new tab.
- `main` should remain deployable.

## Roadmap

### v1.0 — Application Launcher

- [x] Dedicated Internal Links page
- [x] Nextcloud navigation integration
- [x] Administration settings
- [x] Runtime link configuration
- [x] Custom SVG icons
- [x] Open applications in new tabs

### v1.1 — User Interface & Search

- [ ] Modern File Explorer/Finder-inspired interface
- [ ] Compact left-to-right application grid
- [ ] Application search
- [ ] Improved light/dark theme compatibility
- [ ] Improved empty and error states
- [ ] Responsive mobile layout
- [ ] Accessibility and keyboard navigation

### v1.2 — Organization

- [ ] Application categories
- [ ] Drag-and-drop ordering
- [ ] Optional application descriptions
- [ ] Improved icon management
- [ ] Favorites / pinned applications

A future configuration model may resemble:

```json
{
  "id": "payroll",
  "name": "Payroll",
  "url": "https://payroll.example.internal",
  "icon": "money",
  "description": "Payroll and payslips",
  "category": "Finance",
  "order": 10,
  "groups": []
}
```

### v1.3 — Access Control

- [ ] Restrict applications by Nextcloud group
- [ ] Per-application visibility
- [ ] Improved administrator validation
- [ ] Permission-aware application API

## Versioning

The project follows semantic versioning:

```text
MAJOR.MINOR.PATCH
```

Examples:

```text
1.0.0   Initial page-based launcher
1.1.0   UI and search
1.2.0   Categories and ordering
1.3.0   Access control
```

Breaking configuration or API changes should increment the major version.

## Packaging

Create a release archive from the directory containing `internal_links`:

```bash
tar \
  --exclude='.git' \
  --exclude='.DS_Store' \
  -czf internal_links-1.0.0.tar.gz \
  internal_links/
```

The resulting archive can be deployed directly into a Nextcloud `custom_apps` directory.

## License

AGPL-3.0

## Author

TCADC
