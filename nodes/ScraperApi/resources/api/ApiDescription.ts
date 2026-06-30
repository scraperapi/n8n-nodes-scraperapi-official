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
        name: 'apiUrl',
        type: 'string',
        displayOptions: { show: { resource: ['api'] } },
        default: '',
        required: true,
        description: 'Target URL to scrape',
    },
    {
        displayName: 'Optional Parameters',
        name: 'apiOptionalParameters',
        type: 'collection',
        placeholder: 'Add Parameter',
        default: {},
        displayOptions: { show: { resource: ['api'] } },
        options: [
            {
                displayName: 'Autoparse',
                name: 'apiAutoparse',
                type: 'boolean',
                default: true,
                description: 'Whether to activate auto parsing for select websites. The data will be returned in JSON format by default.',
            },
            {
                displayName: 'Country Code',
                name: 'apiCountryCode',
                type: 'string',
                default: '',
                description: 'Two-letter country code for geo-specific scraping',
            },
            {
                displayName: 'Desktop Device',
                name: 'apiDesktopDevice',
                type: 'boolean',
                default: false,
                description: 'Whether to scrape the page as a desktop device',
            },
            {
                displayName: 'Follow Redirect',
                name: 'apiFollowRedirect',
                type: 'boolean',
                default: true,
                description: 'Whether to follow HTTP redirects when fetching the page',
            },
            {
                displayName: 'Keep Headers',
                name: 'apiKeepHeaders',
                type: 'boolean',
                default: false,
                description: 'Whether to keep the original response headers (not available with Ultra Premium)',
            },
            {
                displayName: 'Mobile Device',
                name: 'apiMobileDevice',
                type: 'boolean',
                default: false,
                description: 'Whether to scrape the page as a mobile device',
            },
            {
                displayName: 'Output Format',
                name: 'apiOutputFormat',
                type: 'options',
                options: [
                    { name: 'CSV', value: 'csv' },
                    { name: 'HTML', value: 'html' },
                    { name: 'JSON', value: 'json' },
                    { name: 'Markdown', value: 'markdown' },
                    { name: 'Text', value: 'text' },
                ],
                default: 'html',
                description: 'Output parsing format for the scraped content. If not specified, the content will be returned as HTML. CSV and JSON are only available for autoparse websites.',
            },
            {
                displayName: 'Premium',
                name: 'apiPremium',
                type: 'boolean',
                default: false,
                description: 'Whether to use premium residential/mobile proxies for higher success rate (Can not be combined with UltraPremium)',
            },
            {
                displayName: 'Render',
                name: 'apiRender',
                type: 'boolean',
                default: false,
                description: 'Whether to enable JavaScript rendering only when needed for dynamic content',
            },
            {
                displayName: 'Retry 404',
                name: 'apiRetry404',
                type: 'boolean',
                default: false,
                description: 'Whether to retry requests that return a 404 status code (not available with Premium or Ultra Premium)',
            },
            {
                displayName: 'Session Number',
                name: 'apiSessionNumber',
                type: 'number',
                default: 0,
                description: 'Reuse the same proxy session by passing an integer (not available with Premium or Ultra Premium)',
            },
            {
                displayName: 'Ultra Premium',
                name: 'apiUltraPremium',
                type: 'boolean',
                default: false,
                description: 'Whether to activate advanced bypass mechanisms (Can not be combined with Premium)',
            },
            {
                displayName: 'ZIP Code',
                name: 'apiZipCode',
                type: 'string',
                default: '',
                description: 'US ZIP code for Amazon location-specific results (Amazon US only, e.g. 92223)',
            },
        ],
    },
];

export const ApiFields: INodeProperties[] = [...apiParameters];
