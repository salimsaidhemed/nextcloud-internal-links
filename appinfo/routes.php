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
    ],
];