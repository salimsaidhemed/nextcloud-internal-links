<?php
return [
    'routes' => [
        [
            'name' => 'page#index',
            'url' => '/',
            'verb' => 'GET',
        ],
        [
            'name' => 'sites#index',
            'url' => '/sites',
            'verb' => 'GET',
        ],
        [
            'name' => 'sites#save',
            'url' => '/sites',
            'verb' => 'POST',
        ],
        [
            'name' => 'branding#index',
            'url' => '/branding',
            'verb' => 'GET',
        ],
        [
            'name' => 'branding#save',
            'url' => '/branding',
            'verb' => 'POST',
        ],
    ],
];