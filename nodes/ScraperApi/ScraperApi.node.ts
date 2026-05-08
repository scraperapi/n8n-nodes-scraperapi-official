import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { ApiResource } from './resources/api/ApiResource';
import { ApiOperations, ApiFields } from './resources/api/ApiDescription';
import { CrawlerResource } from './resources/crawler/CrawlerResource';
import { CrawlerOperations, CrawlerFields } from './resources/crawler/CrawlerDescription';
import { SdeResource } from './resources/sde/SdeResource';
import { SdePlatform, SdeOperations, SdeFields } from './resources/sde/SdeDescription';

export class ScraperApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ScraperAPI',
		name: 'scraperApi',
		icon: 'file:../../icons/ScraperApi.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["resource"] === "sde" ? ($parameter["operation"] || "").replace(/([A-Z])/g, " $1").trim() : $parameter["operation"] + ": " + $parameter["resource"] }}',
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
					{ name: 'Crawler', value: 'crawler' },
					{ name: 'Structured Data Endpoint', value: 'sde' },
				],
				default: 'api',
				required: true,
				description: 'Choose your ScraperAPI resource',
				noDataExpression: true,
			},
			...SdePlatform,
			...ApiOperations,
			...SdeOperations,
			...CrawlerOperations,
			...ApiFields,
			...SdeFields,
			...CrawlerFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0);

		const resourceMap = {
			api: ApiResource,
			crawler: CrawlerResource,
			sde: SdeResource,
		} as const;

		const ResourceClass = resourceMap[resource as keyof typeof resourceMap];
		if (!ResourceClass) {
			throw new NodeOperationError(this.getNode(), `Unknown resource type: ${resource}`);
		}

		const executeOne = async (i: number): Promise<INodeExecutionData> => {
			const resourceInstance = new ResourceClass(this);
			const response = await resourceInstance.executeRequest(i);
			return {
				json: {
					resource,
					response: {
						body: response.body,
						headers: response.headers,
						statusCode: response.statusCode,
						statusMessage: response.statusMessage,
					},
				},
				pairedItem: { item: i },
			};
		};

		for (let i = 0; i < items.length; i++) {
			if (this.continueOnFail()) {
				try {
					returnData.push(await executeOne(i));
				} catch (error) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
				}
			} else {
				returnData.push(await executeOne(i));
			}
		}

		return [returnData];
	}
}