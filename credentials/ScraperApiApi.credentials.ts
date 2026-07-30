import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ScraperApiApi implements ICredentialType {
	name = 'scraperApi-Api';
	displayName = 'ScraperAPI API';
	icon: Icon = {
		light: 'file:../icons/scraperapi-light.svg',
		dark: 'file:../icons/scraperapi-dark.svg',
	};
	documentationUrl = 'https://docs.scraperapi.com/dashboard-and-billing/api-key';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				api_key: '={{$credentials.apiKey}}',
			},
		},
	};
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.scraperapi.com',
			url: '/',
			method: 'GET',
			qs: {
				url: 'https://httpbin.org/ip',
			},
		},
	};
}
