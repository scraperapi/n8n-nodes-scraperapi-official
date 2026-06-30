import { CrawlerParameters, CrawlerResponse } from './CrawlerTypes';
import { IExecuteFunctions, IHttpRequestOptions, NodeOperationError } from 'n8n-workflow';

const CRAWLER_BASE_URL = 'https://crawler.scraperapi.com';

interface CreateJobBody extends CrawlerParameters {
	api_key: string;
	scraper_sdk: string;
}

export class CrawlerResource {
	protected n8n: IExecuteFunctions;

	constructor(n8n: IExecuteFunctions) {
		this.n8n = n8n;
	}

	async buildCreateParameters(itemIndex: number): Promise<CreateJobBody> {
		const credentials = (await this.n8n.getCredentials('scraperApi-Api')) as { apiKey: string } | undefined;
		if (!credentials?.apiKey) {
			throw new NodeOperationError(this.n8n.getNode(), 'ScraperAPI API credentials are required');
		}

		const startUrl = this.n8n.getNodeParameter('crawlerStartUrl', itemIndex) as string;
		const urlRegexpInclude = this.n8n.getNodeParameter('crawlerUrlRegexpInclude', itemIndex) as string;
		const callbackUrl = this.n8n.getNodeParameter('crawlerCallbackUrl', itemIndex) as string;

		const optionalParameters = this.n8n.getNodeParameter('crawlerOptionalParameters', itemIndex, {}) as {
			crawlerEnabled?: boolean;
			crawlerScheduleName?: string;
			crawlerScheduleInterval?: 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly';
			crawlerUrlRegexpExclude?: string;
			crawlerApiParameters?: {
				crawlerApiAutoparse?: boolean;
				crawlerApiCountryCode?: string;
				crawlerApiDesktopDevice?: boolean;
				crawlerApiFollowRedirect?: boolean;
				crawlerApiKeepHeaders?: boolean;
				crawlerApiMobileDevice?: boolean;
				crawlerApiOutputFormat?: 'csv' | 'html' | 'json' | 'markdown' | 'text';
				crawlerApiPremium?: boolean;
				crawlerApiRender?: boolean;
				crawlerApiRetry404?: boolean;
				crawlerApiSessionNumber?: number;
				crawlerApiUltraPremium?: boolean;
			};
		};
		const enabled = optionalParameters.crawlerEnabled ?? true;
		const scheduleName = optionalParameters.crawlerScheduleName ?? '';
		const scheduleInterval = optionalParameters.crawlerScheduleInterval ?? 'once';

		const apiParams: CreateJobBody['api_params'] = {};
		const apiOpts = optionalParameters.crawlerApiParameters ?? {};
		if (apiOpts.crawlerApiAutoparse !== undefined) {
			apiParams.autoparse = apiOpts.crawlerApiAutoparse;
		}
		if (apiOpts.crawlerApiCountryCode) {
			apiParams.country_code = apiOpts.crawlerApiCountryCode;
		}
		if (apiOpts.crawlerApiMobileDevice) {
			apiParams.device_type = 'mobile';
		} else if (apiOpts.crawlerApiDesktopDevice) {
			apiParams.device_type = 'desktop';
		}
		if (apiOpts.crawlerApiOutputFormat) {
			apiParams.output_format = apiOpts.crawlerApiOutputFormat;
		}
		if (apiOpts.crawlerApiPremium) {
			apiParams.premium = apiOpts.crawlerApiPremium;
		}
		if (apiOpts.crawlerApiRender !== undefined) {
			apiParams.render = apiOpts.crawlerApiRender;
		}
		if (apiOpts.crawlerApiUltraPremium) {
			apiParams.ultra_premium = apiOpts.crawlerApiUltraPremium;
		}
		if (apiOpts.crawlerApiFollowRedirect !== undefined) {
			apiParams.follow_redirect = apiOpts.crawlerApiFollowRedirect;
		}
		if (apiOpts.crawlerApiKeepHeaders !== undefined) {
			apiParams.keep_headers = apiOpts.crawlerApiKeepHeaders;
		}
		if (apiOpts.crawlerApiRetry404 !== undefined) {
			apiParams.retry_404 = apiOpts.crawlerApiRetry404;
		}
		if (apiOpts.crawlerApiSessionNumber != null && apiOpts.crawlerApiSessionNumber > 0) {
			apiParams.session_number = apiOpts.crawlerApiSessionNumber;
		}

		const params: CreateJobBody = {
			api_key: credentials.apiKey,
			scraper_sdk: 'n8n',
			start_url: startUrl,
			url_regexp_include: urlRegexpInclude,
			schedule: {
				name: scheduleName,
				interval: scheduleInterval,
			},
			callback: {
				type: 'webhook',
				url: callbackUrl,
			},
			api_params: apiParams,
		};

		if (enabled !== undefined) {
			params.enabled = enabled;
		}

		const maxDepth = this.n8n.getNodeParameter('crawlerMaxDepth', itemIndex, 0) as number | null;
		if (maxDepth != null && maxDepth > 0) {
			params.max_depth = maxDepth;
		}

		const crawlBudget = this.n8n.getNodeParameter('crawlerCrawlBudget', itemIndex, 0) as number | null;
		if (crawlBudget != null && crawlBudget > 0) {
			params.crawl_budget = crawlBudget;
		}

		if (params.max_depth === undefined && params.crawl_budget === undefined) {
			throw new NodeOperationError(
				this.n8n.getNode(),
				'Either Max Depth or Crawl Budget must be set',
			);
		}

		const urlRegexpExclude = optionalParameters.crawlerUrlRegexpExclude ?? '';
		if (urlRegexpExclude) {
			params.url_regexp_exclude = urlRegexpExclude;
		}

		return params;
	}

	async createJob(itemIndex: number): Promise<CrawlerResponse> {
		const body = await this.buildCreateParameters(itemIndex);

		const requestOptions: IHttpRequestOptions = {
			method: 'POST',
			baseURL: CRAWLER_BASE_URL,
			url: '/job',
			body,
			returnFullResponse: true,
		};

		const response = await this.n8n.helpers.httpRequest(requestOptions);
		return response;
	}

	async getJob(itemIndex: number): Promise<CrawlerResponse> {
		const jobId = this.n8n.getNodeParameter('crawlerJobId', itemIndex) as string;
		if (!jobId) {
			throw new NodeOperationError(this.n8n.getNode(), 'Job ID is required');
		}

		const credentials = (await this.n8n.getCredentials('scraperApi-Api')) as { apiKey: string } | undefined;
		if (!credentials?.apiKey) {
			throw new NodeOperationError(this.n8n.getNode(), 'ScraperAPI API credentials are required');
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'GET',
			baseURL: CRAWLER_BASE_URL,
			url: `/job/${encodeURIComponent(jobId)}/status`,
			qs: { api_key: credentials.apiKey, scraper_sdk: 'n8n' },
			returnFullResponse: true,
		};

		const response = await this.n8n.helpers.httpRequest(requestOptions);
		return response;
	}

	async deleteJob(itemIndex: number): Promise<CrawlerResponse> {
		const jobId = this.n8n.getNodeParameter('crawlerJobId', itemIndex) as string;
		if (!jobId) {
			throw new NodeOperationError(this.n8n.getNode(), 'Job ID is required');
		}

		const credentials = (await this.n8n.getCredentials('scraperApi-Api')) as { apiKey: string } | undefined;
		if (!credentials?.apiKey) {
			throw new NodeOperationError(this.n8n.getNode(), 'ScraperAPI API credentials are required');
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'DELETE',
			baseURL: CRAWLER_BASE_URL,
			url: `/job/${encodeURIComponent(jobId)}`,
			qs: { api_key: credentials.apiKey, scraper_sdk: 'n8n' },
			returnFullResponse: true,
		};

		const response = await this.n8n.helpers.httpRequest(requestOptions);
		return response;
	}

	async executeRequest(itemIndex: number): Promise<CrawlerResponse> {
		const operation = this.n8n.getNodeParameter('operation', itemIndex);

		switch (operation) {
			case 'crawlerJobCreate':
				return this.createJob(itemIndex);
			case 'crawlerJobGet':
				return this.getJob(itemIndex);
			case 'crawlerJobDelete':
				return this.deleteJob(itemIndex);
			default:
				throw new NodeOperationError(this.n8n.getNode(), `Unknown crawler operation: ${operation}`);
		}
	}
}
