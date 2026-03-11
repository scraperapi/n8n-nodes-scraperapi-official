import { INodeProperties } from 'n8n-workflow';

const amazonTlds = [
	'com', 'co.uk', 'ca', 'de', 'es', 'fr', 'ie', 'it',
	'co.jp', 'co.za', 'in', 'cn', 'com.sg', 'com.mx',
	'ae', 'com.br', 'nl', 'com.au', 'com.tr', 'sa', 'se', 'pl',
].map(v => ({ name: v, value: v }));

const googleTlds = [
	'com', 'co.uk', 'ca', 'de', 'es', 'fr', 'it',
	'co.jp', 'in', 'cn', 'com.sg', 'com.mx',
	'ae', 'com.br', 'nl', 'com.au', 'com.tr', 'sa', 'se', 'pl',
].map(v => ({ name: v, value: v }));

const ebayTlds = [
	'com', 'co.uk', 'com.au', 'de', 'ca', 'fr', 'it', 'es',
	'at', 'ch', 'com.sg', 'com.my', 'ph', 'ie', 'pl', 'nl',
].map(v => ({ name: v, value: v }));

const walmartTlds = [
	{ name: 'com', value: 'com' },
	{ name: 'Ca', value: 'ca' },
];

const redfinTlds = [
	{ name: 'com', value: 'com' },
	{ name: 'Ca', value: 'ca' },
];

// --- Platform selector ---

export const SdePlatform: INodeProperties[] = [
	{
		displayName: 'Platform',
		name: 'sdePlatform',
		type: 'options',
		displayOptions: { show: { resource: ['sde'] } },
		options: [
			{ name: 'Amazon', value: 'amazon' },
			{ name: 'eBay', value: 'ebay' },
			{ name: 'Google', value: 'google' },
			{ name: 'Redfin', value: 'redfin' },
			{ name: 'Walmart', value: 'walmart' },
		],
		default: 'amazon',
		required: true,
		noDataExpression: true,
		description: 'Choose the platform for structured data extraction',
	},
];

// --- Operation selectors (one per platform) ---

export const SdeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['sde'], sdePlatform: ['amazon'] } },
		options: [
			{ name: 'Offers', value: 'amazonOffers', action: 'Get product offers' },
			{ name: 'Product', value: 'amazonProduct', action: 'Get product details' },
			{ name: 'Search', value: 'amazonSearch', action: 'Search products' },
		],
		default: 'amazonProduct',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['sde'], sdePlatform: ['ebay'] } },
		options: [
			{ name: 'Product', value: 'ebayProduct', action: 'Get product details' },
			{ name: 'Search', value: 'ebaySearch', action: 'Search products' },
		],
		default: 'ebaySearch',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['sde'], sdePlatform: ['google'] } },
		options: [
			{ name: 'Jobs', value: 'googleJobs', action: 'Get jobs results' },
			{ name: 'Maps Search', value: 'googleMapsSearch', action: 'Search maps' },
			{ name: 'News', value: 'googleNews', action: 'Get news results' },
			{ name: 'Search', value: 'googleSearch', action: 'Get search results' },
			{ name: 'Shopping', value: 'googleShopping', action: 'Get shopping results' },
		],
		default: 'googleSearch',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['sde'], sdePlatform: ['redfin'] } },
		options: [
			{ name: 'Agent', value: 'redfinAgent', action: 'Get agent details' },
			{ name: 'For Rent', value: 'redfinForRent', action: 'Get rental listings' },
			{ name: 'For Sale', value: 'redfinForSale', action: 'Get sale listings' },
			{ name: 'Search', value: 'redfinSearch', action: 'Search listings' },
		],
		default: 'redfinForSale',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['sde'], sdePlatform: ['walmart'] } },
		options: [
			{ name: 'Category', value: 'walmartCategory', action: 'Browse category' },
			{ name: 'Product', value: 'walmartProduct', action: 'Get product details' },
			{ name: 'Review', value: 'walmartReview', action: 'Get product reviews' },
			{ name: 'Search', value: 'walmartSearch', action: 'Search products' },
		],
		default: 'walmartSearch',
	},
];

// --- Required fields ---

const requiredFields: INodeProperties[] = [
	{
		displayName: 'ASIN',
		name: 'sdeAsin',
		type: 'string',
		required: true,
		default: '',
		description: 'Amazon Standard Identification Number (e.g., B08N5WRWNW)',
		displayOptions: { show: { resource: ['sde'], sdePlatform: ['amazon'], operation: ['amazonProduct', 'amazonOffers'] } },
	},
	{
		displayName: 'Query',
		name: 'sdeQuery',
		type: 'string',
		required: true,
		default: '',
		description: 'Search query',
		displayOptions: {
			show: {
				resource: ['sde'],
				operation: [
					'amazonSearch',
					'googleSearch', 'googleJobs', 'googleNews', 'googleShopping', 'googleMapsSearch',
					'ebaySearch',
					'walmartSearch',
				],
			},
		},
	},
	{
		displayName: 'Product ID',
		name: 'sdeProductId',
		type: 'string',
		required: true,
		default: '',
		description: 'The product/item ID',
		displayOptions: { show: { resource: ['sde'], sdePlatform: ['ebay', 'walmart'], operation: ['ebayProduct', 'walmartProduct', 'walmartReview'] } },
	},
	{
		displayName: 'Category',
		name: 'sdeCategory',
		type: 'string',
		required: true,
		default: '',
		description: 'Walmart category ID',
		displayOptions: { show: { resource: ['sde'], sdePlatform: ['walmart'], operation: ['walmartCategory'] } },
	},
	{
		displayName: 'URL',
		name: 'sdeUrl',
		type: 'string',
		required: true,
		default: '',
		description: 'Full Redfin URL for the search or listing',
		displayOptions: { show: { resource: ['sde'], sdePlatform: ['redfin'], operation: ['redfinForSale', 'redfinForRent', 'redfinSearch', 'redfinAgent'] } },
	},
];

// --- Optional parameter collections (one per platform) ---

const amazonOptions: INodeProperties = {
	displayName: 'Optional Parameters',
	name: 'sdeAmazonOptions',
	type: 'collection',
	placeholder: 'Add Parameter',
	default: {},
	displayOptions: { show: { resource: ['sde'], sdePlatform: ['amazon'] } },
	options: [
		{
			displayName: 'Condition',
			name: 'condition',
			type: 'string',
			default: '',
			description: 'Filter by item condition',
			displayOptions: { show: { '/operation': ['amazonOffers'] } },
		},
		{
			displayName: 'Country Code',
			name: 'countryCode',
			type: 'string',
			default: '',
			description: 'Two-letter country code for geo-targeting',
		},
		{
			displayName: 'Department (I)',
			name: 'department',
			type: 'string',
			default: '',
			description: 'Department/category filter',
			displayOptions: { show: { '/operation': ['amazonSearch'] } },
		},
		{
			displayName: 'Filter New',
			name: 'filterNew',
			type: 'boolean',
			default: false,
			description: 'Whether to filter for new items',
			displayOptions: { show: { '/operation': ['amazonOffers'] } },
		},
		{
			displayName: 'Filter Used Acceptable',
			name: 'filterUsedAcceptable',
			type: 'boolean',
			default: false,
			description: 'Whether to filter for used - acceptable condition',
			displayOptions: { show: { '/operation': ['amazonOffers'] } },
		},
		{
			displayName: 'Filter Used Good',
			name: 'filterUsedGood',
			type: 'boolean',
			default: false,
			description: 'Whether to filter for used - good condition',
			displayOptions: { show: { '/operation': ['amazonOffers'] } },
		},
		{
			displayName: 'Filter Used Like New',
			name: 'filterUsedLikeNew',
			type: 'boolean',
			default: false,
			description: 'Whether to filter for used - like new condition',
			displayOptions: { show: { '/operation': ['amazonOffers'] } },
		},
		{
			displayName: 'Filter Used Very Good',
			name: 'filterUsedVeryGood',
			type: 'boolean',
			default: false,
			description: 'Whether to filter for used - very good condition',
			displayOptions: { show: { '/operation': ['amazonOffers'] } },
		},
		{
			displayName: 'Output Format',
			name: 'outputFormat',
			type: 'options',
			options: [
				{ name: 'CSV', value: 'csv' },
				{ name: 'JSON', value: 'json' },
			],
			default: 'json',
			description: 'Output format for the response',
		},
		{
			displayName: 'Page',
			name: 'page',
			type: 'number',
			default: 1,
			description: 'Page number of search results',
			displayOptions: { show: { '/operation': ['amazonSearch'] } },
		},
		{
			displayName: 'Sort (S)',
			name: 'sort',
			type: 'string',
			default: '',
			description: 'Sort parameter for search results',
			displayOptions: { show: { '/operation': ['amazonSearch'] } },
		},
		{
			displayName: 'TLD',
			name: 'tld',
			type: 'options',
			options: amazonTlds,
			default: 'com',
			description: 'Amazon top-level domain',
		},
	],
};

const googleOptions: INodeProperties = {
	displayName: 'Optional Parameters',
	name: 'sdeGoogleOptions',
	type: 'collection',
	placeholder: 'Add Parameter',
	default: {},
	displayOptions: { show: { resource: ['sde'], sdePlatform: ['google'] } },
	options: [
		{
			displayName: 'Country Code',
			name: 'countryCode',
			type: 'string',
			default: '',
			description: 'Two-letter country code for geo-targeting',
		},
		{
			displayName: 'Include HTML',
			name: 'includeHtml',
			type: 'boolean',
			default: false,
			description: 'Whether to include raw HTML in the response',
			displayOptions: { show: { '/operation': ['googleSearch', 'googleShopping', 'googleMapsSearch'] } },
		},
		{
			displayName: 'Latitude',
			name: 'latitude',
			type: 'string',
			default: '',
			description: 'Latitude for location-based search',
			displayOptions: { show: { '/operation': ['googleMapsSearch'] } },
		},
		{
			displayName: 'Longitude',
			name: 'longitude',
			type: 'string',
			default: '',
			description: 'Longitude for location-based search',
			displayOptions: { show: { '/operation': ['googleMapsSearch'] } },
		},
		{
			displayName: 'Output Format',
			name: 'outputFormat',
			type: 'options',
			options: [
				{ name: 'CSV', value: 'csv' },
				{ name: 'JSON', value: 'json' },
			],
			default: 'json',
			description: 'Output format for the response',
			displayOptions: { show: { '/operation': ['googleSearch', 'googleJobs', 'googleNews', 'googleShopping'] } },
		},
		{
			displayName: 'Time Period',
			name: 'timePeriod',
			type: 'options',
			options: [
				{ name: 'Past Day', value: 'qdr:d' },
				{ name: 'Past Hour', value: 'qdr:h' },
				{ name: 'Past Month', value: 'qdr:m' },
				{ name: 'Past Week', value: 'qdr:w' },
				{ name: 'Past Year', value: 'qdr:y' },
			],
			default: 'qdr:d',
			description: 'Predefined time period filter',
			displayOptions: { show: { '/operation': ['googleSearch', 'googleNews'] } },
		},
		{
			displayName: 'TLD',
			name: 'tld',
			type: 'options',
			options: googleTlds,
			default: 'com',
			description: 'Google top-level domain',
		},
		{
			displayName: 'Zoom',
			name: 'zoom',
			type: 'number',
			default: 14,
			description: 'Zoom level for the map search',
			displayOptions: { show: { '/operation': ['googleMapsSearch'] } },
		},
	],
};

const ebayOptions: INodeProperties = {
	displayName: 'Optional Parameters',
	name: 'sdeEbayOptions',
	type: 'collection',
	placeholder: 'Add Parameter',
	default: {},
	displayOptions: { show: { resource: ['sde'], sdePlatform: ['ebay'] } },
	options: [
		{
			displayName: 'Buying Format',
			name: 'buyingFormat',
			type: 'options',
			options: [
				{ name: 'Accepts Offers', value: 'accepts_offers' },
				{ name: 'Auction', value: 'auction' },
				{ name: 'Buy It Now', value: 'buy_it_now' },
			],
			default: 'buy_it_now',
			description: 'Filter by buying format',
			displayOptions: { show: { '/operation': ['ebaySearch'] } },
		},
		{
			displayName: 'Condition',
			name: 'condition',
			type: 'options',
			options: [
				{ name: 'For Parts', value: 'for_parts' },
				{ name: 'New', value: 'new' },
				{ name: 'Not Working', value: 'not_working' },
				{ name: 'Open Box', value: 'open_box' },
				{ name: 'Refurbished', value: 'refurbished' },
				{ name: 'Used', value: 'used' },
			],
			default: 'new',
			description: 'Filter by item condition',
			displayOptions: { show: { '/operation': ['ebaySearch'] } },
		},
		{
			displayName: 'Country Code',
			name: 'countryCode',
			type: 'string',
			default: '',
			description: 'Two-letter country code for geo-targeting',
		},
		{
			displayName: 'Items Per Page',
			name: 'itemsPerPage',
			type: 'options',
			options: [
				{ name: '60', value: 60 },
				{ name: '120', value: 120 },
				{ name: '240', value: 240 },
			],
			default: 60,
			description: 'Number of items per page',
			displayOptions: { show: { '/operation': ['ebaySearch'] } },
		},
		{
			displayName: 'Output Format',
			name: 'outputFormat',
			type: 'options',
			options: [
				{ name: 'CSV', value: 'csv' },
				{ name: 'JSON', value: 'json' },
			],
			default: 'json',
			description: 'Output format for the response',
		},
		{
			displayName: 'Page',
			name: 'page',
			type: 'number',
			default: 1,
			description: 'Page number of search results',
			displayOptions: { show: { '/operation': ['ebaySearch'] } },
		},
		{
			displayName: 'Seller ID',
			name: 'sellerId',
			type: 'string',
			default: '',
			description: 'Filter by specific seller',
			displayOptions: { show: { '/operation': ['ebaySearch'] } },
		},
		{
			displayName: 'Show Only',
			name: 'showOnly',
			type: 'string',
			default: '',
			description: 'Additional filters (comma-separated). Values: returns_accepted, authorized_seller, completed_items, sold_items, sale_items, listed_as_lots, search_in_description, benefits_charity, authenticity_guarantee.',
			displayOptions: { show: { '/operation': ['ebaySearch'] } },
		},
		{
			displayName: 'Sort By',
			name: 'sortBy',
			type: 'options',
			options: [
				{ name: 'Best Match', value: 'best_match' },
				{ name: 'Distance Nearest', value: 'distance_nearest' },
				{ name: 'Ending Soonest', value: 'ending_soonest' },
				{ name: 'Newly Listed', value: 'newly_listed' },
				{ name: 'Price Highest', value: 'price_highest' },
				{ name: 'Price Lowest', value: 'price_lowest' },
			],
			default: 'best_match',
			description: 'Sort order for search results',
			displayOptions: { show: { '/operation': ['ebaySearch'] } },
		},
		{
			displayName: 'TLD',
			name: 'tld',
			type: 'options',
			options: ebayTlds,
			default: 'com',
			description: 'EBay top-level domain',
		},
	],
};

const walmartOptions: INodeProperties = {
	displayName: 'Optional Parameters',
	name: 'sdeWalmartOptions',
	type: 'collection',
	placeholder: 'Add Parameter',
	default: {},
	displayOptions: { show: { resource: ['sde'], sdePlatform: ['walmart'] } },
	options: [
		{
			displayName: 'Country Code',
			name: 'countryCode',
			type: 'string',
			default: '',
			description: 'Two-letter country code for geo-targeting',
		},
		{
			displayName: 'Output Format',
			name: 'outputFormat',
			type: 'options',
			options: [
				{ name: 'CSV', value: 'csv' },
				{ name: 'JSON', value: 'json' },
			],
			default: 'json',
			description: 'Output format for the response',
		},
		{
			displayName: 'Page',
			name: 'page',
			type: 'number',
			default: 1,
			description: 'Page number of results',
			displayOptions: { show: { '/operation': ['walmartSearch', 'walmartCategory', 'walmartReview'] } },
		},
		{
			displayName: 'Ratings',
			name: 'ratings',
			type: 'string',
			default: '',
			description: 'Filter by rating',
			displayOptions: { show: { '/operation': ['walmartReview'] } },
		},
		{
			displayName: 'Sort',
			name: 'sort',
			type: 'options',
			options: [
				{ name: 'Helpful', value: 'helpful' },
				{ name: 'Newest', value: 'submission-desc' },
				{ name: 'Oldest', value: 'submission-asc' },
				{ name: 'Rating High to Low', value: 'rating-desc' },
				{ name: 'Rating Low to High', value: 'rating-asc' },
				{ name: 'Relevancy', value: 'relevancy' },
			],
			default: 'relevancy',
			description: 'Sort order for reviews',
			displayOptions: { show: { '/operation': ['walmartReview'] } },
		},
		{
			displayName: 'TLD',
			name: 'tld',
			type: 'options',
			options: walmartTlds,
			default: 'com',
			description: 'Walmart top-level domain',
		},
		{
			displayName: 'Verified Purchase',
			name: 'verifiedPurchase',
			type: 'boolean',
			default: false,
			description: 'Whether to filter for verified purchases only',
			displayOptions: { show: { '/operation': ['walmartReview'] } },
		},
	],
};

const redfinOptions: INodeProperties = {
	displayName: 'Optional Parameters',
	name: 'sdeRedfinOptions',
	type: 'collection',
	placeholder: 'Add Parameter',
	default: {},
	displayOptions: { show: { resource: ['sde'], sdePlatform: ['redfin'] } },
	options: [
		{
			displayName: 'Country Code',
			name: 'countryCode',
			type: 'string',
			default: '',
			description: 'Two-letter country code for geo-targeting',
		},
		{
			displayName: 'Raw',
			name: 'raw',
			type: 'boolean',
			default: false,
			description: 'Whether to return raw data',
			displayOptions: { show: { '/operation': ['redfinForSale', 'redfinForRent'] } },
		},
		{
			displayName: 'TLD',
			name: 'tld',
			type: 'options',
			options: redfinTlds,
			default: 'com',
			description: 'Redfin top-level domain',
		},
	],
};

export const SdeFields: INodeProperties[] = [
	...requiredFields,
	amazonOptions,
	googleOptions,
	ebayOptions,
	walmartOptions,
	redfinOptions,
];
