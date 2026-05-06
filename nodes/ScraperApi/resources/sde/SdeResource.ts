import { SdeResponse } from './SdeTypes';
import { IExecuteFunctions, IHttpRequestOptions, NodeOperationError } from 'n8n-workflow';

interface OperationConfig {
	path: string;
	required: { field: string; param: string }[];
	collection: string;
	optional: Record<string, string>;
}

const OPERATION_CONFIG: Record<string, OperationConfig> = {
	amazonProduct: {
		path: '/structured/amazon/product',
		required: [{ field: 'sdeAsin', param: 'asin' }],
		collection: 'sdeAmazonProductOptions',
		optional: {
			tld: 'tld',
			countryCode: 'country_code',
			outputFormat: 'output_format',
		},
	},
	amazonSearch: {
		path: '/structured/amazon/search',
		required: [{ field: 'sdeQuery', param: 'query' }],
		collection: 'sdeAmazonSearchOptions',
		optional: {
			tld: 'tld',
			countryCode: 'country_code',
			outputFormat: 'output_format',
			page: 'page',
			sort: 's',
			department: 'i',
		},
	},
	amazonOffers: {
		path: '/structured/amazon/offers',
		required: [{ field: 'sdeAsin', param: 'asin' }],
		collection: 'sdeAmazonOffersOptions',
		optional: {
			tld: 'tld',
			countryCode: 'country_code',
			outputFormat: 'output_format',
			condition: 'condition',
			filterNew: 'filter_new',
			filterUsedGood: 'filter_used_good',
			filterUsedLikeNew: 'filter_used_like_new',
			filterUsedVeryGood: 'filter_used_very_good',
			filterUsedAcceptable: 'filter_used_acceptable',
		},
	},
	googleSearch: {
		path: '/structured/google/search',
		required: [{ field: 'sdeQuery', param: 'query' }],
		collection: 'sdeGoogleSearchOptions',
		optional: {
			tld: 'tld',
			countryCode: 'country_code',
			outputFormat: 'output_format',
			timePeriod: 'tbs',
			includeHtml: 'include_html',
		},
	},
	googleJobs: {
		path: '/structured/google/jobs',
		required: [{ field: 'sdeQuery', param: 'query' }],
		collection: 'sdeGoogleJobsOptions',
		optional: {
			tld: 'tld',
			countryCode: 'country_code',
			outputFormat: 'output_format',
		},
	},
	googleNews: {
		path: '/structured/google/news',
		required: [{ field: 'sdeQuery', param: 'query' }],
		collection: 'sdeGoogleNewsOptions',
		optional: {
			tld: 'tld',
			countryCode: 'country_code',
			outputFormat: 'output_format',
			timePeriod: 'tbs',
		},
	},
	googleShopping: {
		path: '/structured/google/shopping',
		required: [{ field: 'sdeQuery', param: 'query' }],
		collection: 'sdeGoogleShoppingOptions',
		optional: {
			tld: 'tld',
			countryCode: 'country_code',
			outputFormat: 'output_format',
			includeHtml: 'include_html',
		},
	},
	googleMapsSearch: {
		path: '/structured/google/mapssearch',
		required: [{ field: 'sdeQuery', param: 'query' }],
		collection: 'sdeGoogleMapsSearchOptions',
		optional: {
			tld: 'tld',
			countryCode: 'country_code',
			latitude: 'latitude',
			longitude: 'longitude',
			zoom: 'zoom',
			includeHtml: 'include_html',
		},
	},
	ebaySearch: {
		path: '/structured/ebay/search/v2',
		required: [{ field: 'sdeQuery', param: 'query' }],
		collection: 'sdeEbaySearchOptions',
		optional: {
			tld: 'tld',
			countryCode: 'country_code',
			outputFormat: 'output_format',
			page: 'page',
			itemsPerPage: 'items_per_page',
			sellerId: 'seller_id',
			condition: 'condition',
			buyingFormat: 'buying_format',
			showOnly: 'show_only',
			sortBy: 'sort_by',
		},
	},
	ebayProduct: {
		path: '/structured/ebay/product',
		required: [{ field: 'sdeProductId', param: 'product_id' }],
		collection: 'sdeEbayProductOptions',
		optional: {
			tld: 'tld',
			countryCode: 'country_code',
			outputFormat: 'output_format',
		},
	},
	walmartSearch: {
		path: '/structured/walmart/search',
		required: [{ field: 'sdeQuery', param: 'query' }],
		collection: 'sdeWalmartSearchOptions',
		optional: {
			tld: 'tld',
			countryCode: 'country_code',
			outputFormat: 'output_format',
			page: 'page',
		},
	},
	walmartCategory: {
		path: '/structured/walmart/category',
		required: [{ field: 'sdeCategory', param: 'category' }],
		collection: 'sdeWalmartSearchOptions',
		optional: {
			tld: 'tld',
			countryCode: 'country_code',
			outputFormat: 'output_format',
			page: 'page',
		},
	},
	walmartProduct: {
		path: '/structured/walmart/product',
		required: [{ field: 'sdeProductId', param: 'product_id' }],
		collection: 'sdeWalmartProductOptions',
		optional: {
			tld: 'tld',
			countryCode: 'country_code',
			outputFormat: 'output_format',
		},
	},
	walmartReview: {
		path: '/structured/walmart/review',
		required: [{ field: 'sdeProductId', param: 'product_id' }],
		collection: 'sdeWalmartReviewOptions',
		optional: {
			tld: 'tld',
			countryCode: 'country_code',
			outputFormat: 'output_format',
			page: 'page',
			sort: 'sort',
			ratings: 'ratings',
			verifiedPurchase: 'verified_purchase',
		},
	},
	redfinForSale: {
		path: '/structured/redfin/forsale',
		required: [{ field: 'sdeUrl', param: 'url' }],
		collection: 'sdeRedfinListingOptions',
		optional: {
			tld: 'tld',
			countryCode: 'country_code',
			raw: 'raw',
		},
	},
	redfinForRent: {
		path: '/structured/redfin/forrent',
		required: [{ field: 'sdeUrl', param: 'url' }],
		collection: 'sdeRedfinListingOptions',
		optional: {
			tld: 'tld',
			countryCode: 'country_code',
			raw: 'raw',
		},
	},
	redfinSearch: {
		path: '/structured/redfin/search',
		required: [{ field: 'sdeUrl', param: 'url' }],
		collection: 'sdeRedfinLookupOptions',
		optional: {
			tld: 'tld',
			countryCode: 'country_code',
		},
	},
	redfinAgent: {
		path: '/structured/redfin/agent',
		required: [{ field: 'sdeUrl', param: 'url' }],
		collection: 'sdeRedfinLookupOptions',
		optional: {
			tld: 'tld',
			countryCode: 'country_code',
		},
	},
};

export class SdeResource {
	protected n8n: IExecuteFunctions;

	constructor(n8n: IExecuteFunctions) {
		this.n8n = n8n;
	}

	async executeRequest(itemIndex: number): Promise<SdeResponse> {
		const operation = this.n8n.getNodeParameter('operation', itemIndex) as string;
		const config = OPERATION_CONFIG[operation];

		if (!config) {
			throw new NodeOperationError(this.n8n.getNode(), `Unknown SDE operation: ${operation}`);
		}

		const qs: Record<string, string | number | boolean> = {
			scraper_sdk: 'n8n',
		};

		for (const { field, param } of config.required) {
			const value = this.n8n.getNodeParameter(field, itemIndex) as string;
			if (!value) {
				throw new NodeOperationError(this.n8n.getNode(), `${field} is required`);
			}
			qs[param] = value;
		}

		const opts = this.n8n.getNodeParameter(config.collection, itemIndex, {}) as Record<string, unknown>;
		for (const [n8nName, apiName] of Object.entries(config.optional)) {
			const value = opts[n8nName];
			if (value !== undefined && value !== '' && value !== null) {
				qs[apiName] = value as string | number | boolean;
			}
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'GET',
			baseURL: 'https://api.scraperapi.com',
			url: config.path,
			qs,
			returnFullResponse: true,
		};

		const response = await this.n8n.helpers.httpRequestWithAuthentication.call(
			this.n8n,
			'scraperApi-Api',
			requestOptions,
		);

		return response;
	}
}
