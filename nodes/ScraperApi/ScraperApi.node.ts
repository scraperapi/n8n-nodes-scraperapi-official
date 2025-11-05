import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

export class ScraperApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ScraperAPI',
		name: 'scraperApi',
		icon: 'file:../../icons/ScraperApi.svg',
		group: ['transform'],
		version: 1,
		description: 'Official ScraperAPI nodes for n8n',
		defaults: {
			name: 'ScraperAPI',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'scraperApi-Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{ name: 'API', value: 'api' },
				],
				default: 'api',
				required: true,
				description: 'Choose your ScraperAPI resource',
				noDataExpression: true,
			},
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
						displayName: 'Country Code',
						name: 'country_code',
						type: 'string',
						default: '',
						description: 'Two-letter country code for geo-specific scraping',
					},
					{
						displayName: 'Device Type',
						name: 'device_type',
						type: 'options',
						default: 'desktop',
						options: [
							{ name: 'Desktop', value: 'desktop' },
							{ name: 'Mobile', value: 'mobile' },
						],
						description: 'Choose the device type to scrape the page on',
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
			}
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'api') {
					const url = this.getNodeParameter('url', i) as string;

					if (!url) {
						throw new NodeOperationError(this.getNode(), 'URL is required');
					}

					const optionalParameters = this.getNodeParameter('optionalParameters', i, {}) as {
						render?: boolean;
						country_code?: string;
						premium?: boolean;
						ultraPremium?: boolean;
						device_type?: string;
					};

					const render = optionalParameters.render ?? false;
					const countryCode = optionalParameters.country_code ?? '';
					const premium = optionalParameters.premium ?? false;
					const ultraPremium = optionalParameters.ultraPremium ?? false;
					const deviceType = optionalParameters.device_type ?? 'desktop';

					const credentials = await this.getCredentials('scraperApi-Api');

					const qs: Record<string, string | boolean> = {
						api_key: credentials.apiKey as string,
						url,
						output_format: 'json',
						autoparse: true,
					};

					if (render) {
						qs.render = true;
					}

					if (countryCode) {
						qs.country_code = countryCode;
					}

					if (premium) {
						qs.premium = true;
					}

					if (ultraPremium) {
						qs.ultra_premium = true;
					}

					if (deviceType) {
						qs.device_type = deviceType;
					}

					const response = await this.helpers.httpRequest({
						method: 'GET',
						baseURL: 'https://api.scraperapi.com',
						url: '/',
						qs,
						returnFullResponse: true,
					});

					returnData.push({
						json: {
							html: response.body,
							statusCode: response.statusCode,
							headers: response.headers,
							url,
						},
						pairedItem: {
							item: i,
						},
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}