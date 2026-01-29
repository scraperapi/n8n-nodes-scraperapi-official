import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { ApiResource } from './resources/api/ApiResource';
import { ApiOperations, ApiFields } from './resources/api/ApiDescription';

export class ScraperApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ScraperAPI',
		name: 'scraperApi',
		icon: 'file:../../icons/ScraperApi.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
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
			...ApiOperations,
			...ApiFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'api') {
					const apiResource = new ApiResource(this);
					const response = await apiResource.executeRequest(i);

					returnData.push({
						json: {
							resource: 'api',
							response: {
								body: response.body,
								headers: response.headers,
								statusCode: response.statusCode,
								statusMessage: response.statusMessage,
							},
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