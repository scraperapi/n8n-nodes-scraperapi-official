import { ApiParameters, ApiResponse } from './types.js';
import { IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';

export class ApiResource {
    protected n8n: IExecuteFunctions;

	constructor(n8n: IExecuteFunctions) {
		this.n8n = n8n;
	}

	async submitApiRequest(params: ApiParameters): Promise<ApiResponse> {
		const qs: Record<string, string | boolean> = {
			url: params.url,
			output_format: 'json',
			autoparse: true,
            scraper_sdk: 'n8n',
		};

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
}
