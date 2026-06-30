import { ApiParameters, ApiResponse } from './ApiTypes';
import { IExecuteFunctions, IHttpRequestOptions, NodeOperationError } from 'n8n-workflow';

export class ApiResource {
	protected n8n: IExecuteFunctions;

	constructor(n8n: IExecuteFunctions) {
		this.n8n = n8n;
	}
	buildParameters(itemIndex: number): ApiParameters {
		const url = this.n8n.getNodeParameter('apiUrl', itemIndex) as string;

		if (!url) {
			throw new NodeOperationError(this.n8n.getNode(), 'URL is required');
		}

		const optionalParameters = this.n8n.getNodeParameter('apiOptionalParameters', itemIndex, {}) as {
			apiRender?: boolean;
			apiCountryCode?: string;
			apiPremium?: boolean;
			apiUltraPremium?: boolean;
			apiDesktopDevice?: boolean;
			apiMobileDevice?: boolean;
			apiOutputFormat?: 'markdown' | 'text' | 'csv' | 'json';
			apiAutoparse?: boolean;
			apiZipCode?: string;
			apiSessionNumber?: number;
			apiKeepHeaders?: boolean;
			apiFollowRedirect?: boolean;
			apiRetry404?: boolean;
		};

		const apiParams: ApiParameters = {
			url,
		};

		if (optionalParameters.apiRender) {
			apiParams.render = optionalParameters.apiRender;
		}

		if (optionalParameters.apiCountryCode) {
			apiParams.country_code = optionalParameters.apiCountryCode;
		}

		if (optionalParameters.apiPremium) {
			apiParams.premium = optionalParameters.apiPremium;
		}

		if (optionalParameters.apiUltraPremium) {
			apiParams.ultra_premium = optionalParameters.apiUltraPremium;
		}

		if (optionalParameters.apiMobileDevice) {
			apiParams.device_type = 'mobile';
		} else if (optionalParameters.apiDesktopDevice) {
			apiParams.device_type = 'desktop';
		}

		if (optionalParameters.apiOutputFormat) {
			apiParams.output_format = optionalParameters.apiOutputFormat;
		}

		if (optionalParameters.apiAutoparse !== undefined) {
			apiParams.autoparse = optionalParameters.apiAutoparse;
		}

		if (optionalParameters.apiZipCode) {
			apiParams.zip = optionalParameters.apiZipCode;
		}

		if (optionalParameters.apiSessionNumber != null && optionalParameters.apiSessionNumber > 0) {
			apiParams.session_number = optionalParameters.apiSessionNumber;
		}

		if (optionalParameters.apiKeepHeaders !== undefined) {
			apiParams.keep_headers = optionalParameters.apiKeepHeaders;
		}

		if (optionalParameters.apiFollowRedirect !== undefined) {
			apiParams.follow_redirect = optionalParameters.apiFollowRedirect;
		}

		if (optionalParameters.apiRetry404 !== undefined) {
			apiParams.retry_404 = optionalParameters.apiRetry404;
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

		if (params.zip) {
			qs.zip = params.zip;
		}

		if (params.session_number) {
			qs.session_number = params.session_number;
		}

		if (params.keep_headers !== undefined) {
			qs.keep_headers = params.keep_headers;
		}

		if (params.follow_redirect !== undefined) {
			qs.follow_redirect = params.follow_redirect;
		}

		if (params.retry_404 !== undefined) {
			qs.retry_404 = params.retry_404;
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
