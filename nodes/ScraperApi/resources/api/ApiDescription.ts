import { INodeProperties } from "n8n-workflow";

export const ApiOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['api'],
			},
		},
		options: [
			{
				name: 'Send a Request',
				value: 'apiRequest',
				action: 'Send a request to the API',
			},
		],
		default: 'apiRequest',
	},
];

const apiParameters: INodeProperties[] = [
    {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        displayOptions: { show: { resource: ['api'] } },
        default: '',
        required: true,
        description: 'Target URL to scrape',
    },
    {
        displayName: 'Optional Parameters',
        name: 'optionalParameters',
        type: 'collection',
        placeholder: 'Add Parameter',
        default: {},
        displayOptions: { show: { resource: ['api'] } },
        options: [
            {
                displayName: 'Autoparse',
                name: 'autoparse',
                type: 'boolean',
                default: true,
                description: 'Whether to activate auto parsing for select websites. The data will be returned in JSON format by default.',
            },
            {
                displayName: 'Country Code',
                name: 'countryCode',
                type: 'string',
                default: '',
                description: 'Two-letter country code for geo-specific scraping',
            },
            {
                displayName: 'Desktop Device',
                name: 'desktopDevice',
                type: 'boolean',
                default: false,
                description: 'Whether to scrape the page as a desktop device',
            },
            {
                displayName: 'Mobile Device',
                name: 'mobileDevice',
                type: 'boolean',
                default: false,
                description: 'Whether to scrape the page as a mobile device',
            },
            {
                displayName: 'Output Format',
                name: 'outputFormat',
                type: 'options',
                options: [
                    { name: 'Markdown', value: 'markdown' },
                    { name: 'Text', value: 'text' },
                    { name: 'CSV', value: 'csv' },
                    { name: 'JSON', value: 'json' },
                ],
                default: 'json',
                description: 'Output parsing format for the scraped content. If not specified, the content will be returned as HTML. CSV and JSON are only available for autoparse websites.',
            },
            {
                displayName: 'Premium',
                name: 'premium',
                type: 'boolean',
                default: false,
                description: 'Whether to use premium residential/mobile proxies for higher success rate (Can not be combined with UltraPremium)',
            },
            {
                displayName: 'Render',
                name: 'render',
                type: 'boolean',
                default: false,
                description: 'Whether to enable JavaScript rendering only when needed for dynamic content',
            },
            {
                displayName: 'Ultra Premium',
                name: 'ultraPremium',
                type: 'boolean',
                default: false,
                description: 'Whether to activate advanced bypass mechanisms (Can not be combined with Premium)',
            },
        ],
    },
];

export const ApiFields: INodeProperties[] = [...apiParameters];
