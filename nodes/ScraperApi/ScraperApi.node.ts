import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { ApiResource } from './resources/ApiResource.js';

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
					const apiResource = new ApiResource(this);
					const response = await apiResource.executeRequest(i);

					returnData.push({
						json: {
							body: response.body,
							headers: response.headers,
							statusCode: response.statusCode,
							statusMessage: response.statusMessage,
						},
						pairedItem: {
							item: i,
						},
					});
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource type: ${resource}`);
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