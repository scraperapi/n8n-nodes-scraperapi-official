import { ApiParameters, ApiResponse } from './ApiTypes';
import { IExecuteFunctions, IHttpRequestOptions, NodeOperationError } from 'n8n-workflow';

export class ApiResource {
	protected n8n: IExecuteFunctions;

	constructor(n8n: IExecuteFunctions) {
		this.n8n = n8n;
	}
	buildParameters(itemIndex: number): ApiParameters {
		const url = this.n8n.getNodeParameter('url', itemIndex) as string;

		if (!url) {
			throw new NodeOperationError(this.n8n.getNode(), 'URL is required');
		}

		const optionalParameters = this.n8n.getNodeParameter('optionalParameters', itemIndex, {}) as {
			render?: boolean;
			country_code?: string;
			premium?: boolean;
			ultraPremium?: boolean;
			desktopDevice?: boolean;
			mobileDevice?: boolean;
			output_format?: 'markdown' | 'text' | 'csv' | 'json';
			autoparse?: boolean;
		};

		const apiParams: ApiParameters = {
			url,
		};

		if (optionalParameters.render) {
			apiParams.render = optionalParameters.render;
		}

		if (optionalParameters.country_code) {
			apiParams.country_code = optionalParameters.country_code;
		}

		if (optionalParameters.premium) {
			apiParams.premium = optionalParameters.premium;
		}

		if (optionalParameters.ultraPremium) {
			apiParams.ultra_premium = optionalParameters.ultraPremium;
		}

		if (optionalParameters.mobileDevice) {
			apiParams.device_type = 'mobile';
		} else if (optionalParameters.desktopDevice) {
			apiParams.device_type = 'desktop';
		}

		if (optionalParameters.output_format) {
			apiParams.output_format = optionalParameters.output_format;
		}

		if (optionalParameters.autoparse !== undefined) {
			apiParams.autoparse = optionalParameters.autoparse;
		}

		return apiParams;
	}

	async submitRequest(params: ApiParameters): Promise<ApiResponse> {
		const qs: Record<string, string | boolean | number> = {
			url: params.url,
            scraper_sdk: 'n8n',
		};

		if (params.autoparse) {
			qs.autoparse = params.autoparse;
		}

		if (params.output_format) {
			qs.output_format = params.output_format;
		}

		if (params.render) {
			qs.render = true;
		}

		if (params.country_code) {
			qs.country_code = params.country_code;
		}

		if (params.premium) {
			qs.premium = true;
		}

		if (params.ultra_premium) {
			qs.ultra_premium = true;
		}

		if (params.device_type) {
			qs.device_type = params.device_type;
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'GET',
			baseURL: 'https://api.scraperapi.com',
			url: '/',
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

	async executeRequest(itemIndex: number): Promise<ApiResponse> {
		const params = this.buildParameters(itemIndex);
		return this.submitRequest(params);
	}
}
