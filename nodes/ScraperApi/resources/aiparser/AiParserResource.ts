import {
    AiParserField,
    AiParserRenameField,
    AiParserScraperParams,
    AiParserResponse,
    CreateParserBody,
    UpdateParserBody,
} from './AiParserTypes';
import { IExecuteFunctions, IHttpRequestOptions, NodeOperationError } from 'n8n-workflow';

const AIPARSER_BASE_URL = 'https://aiparser.scraperapi.com';

interface ScraperParamCollection {
    render?: boolean;
    country_code?: string;
    premium?: boolean;
    session_number?: number;
    keep_headers?: boolean;
    device_type?: 'desktop' | 'mobile';
    ultra_premium?: boolean;
    follow_redirect?: boolean;
    retry_404?: boolean;
}

interface FieldCollection {
    field?: Array<{
        name?: string;
        description?: string;
        type?: 'string' | 'number' | 'array';
        selector?: string;
    }>;
}

interface RenameFieldCollection {
    field?: Array<{ name?: string; new_name?: string }>;
}

export class AiParserResource {
    protected n8n: IExecuteFunctions;

    constructor(n8n: IExecuteFunctions) {
        this.n8n = n8n;
    }

    private async getApiKey(): Promise<string> {
        const credentials = (await this.n8n.getCredentials('scraperApi-Api')) as { apiKey: string } | undefined;
        if (!credentials?.apiKey) {
            throw new NodeOperationError(this.n8n.getNode(), 'ScraperAPI API credentials are required');
        }
        return credentials.apiKey;
    }

    // Builds the optional `/{version}` path segment. Returns '' when no version is set so the request targets the parser's latest version.
    private versionPathSegment(itemIndex: number): string {
        const version = this.n8n.getNodeParameter('aiParserVersion', itemIndex, -1) as number;
        if (version == null || version < 0) {
            return '';
        }
        if (!Number.isInteger(version)) {
            throw new NodeOperationError(this.n8n.getNode(), 'Version must be a non-negative integer');
        }
        return `/${encodeURIComponent(version)}`;
    }

    private buildScraperParams(itemIndex: number): AiParserScraperParams {
        const raw = this.n8n.getNodeParameter('aiParserScraperParams', itemIndex, {}) as ScraperParamCollection;
        const scraperParams: AiParserScraperParams = {};

        if (raw.render !== undefined) {
            scraperParams.render = raw.render;
        }
        if (raw.country_code) {
            scraperParams.country_code = raw.country_code;
        }
        if (raw.premium !== undefined) {
            scraperParams.premium = raw.premium;
        }
        if (raw.session_number != null && raw.session_number > 0) {
            scraperParams.session_number = raw.session_number;
        }
        if (raw.keep_headers !== undefined) {
            scraperParams.keep_headers = raw.keep_headers;
        }
        if (raw.device_type) {
            scraperParams.device_type = raw.device_type;
        }
        if (raw.ultra_premium !== undefined) {
            scraperParams.ultra_premium = raw.ultra_premium;
        }
        if (raw.follow_redirect !== undefined) {
            scraperParams.follow_redirect = raw.follow_redirect;
        }
        if (raw.retry_404 !== undefined) {
            scraperParams.retry_404 = raw.retry_404;
        }

        return scraperParams;
    }

    private buildFields(parameterName: string, itemIndex: number): AiParserField[] {
        const raw = this.n8n.getNodeParameter(parameterName, itemIndex, {}) as FieldCollection;
        const entries = raw.field ?? [];
        const fields: AiParserField[] = [];

        for (const entry of entries) {
            if (!entry.name || !entry.description) {
                continue;
            }
            const field: AiParserField = {
                name: entry.name,
                description: entry.description,
            };
            if (entry.type) {
                field.type = entry.type;
            }
            if (entry.selector) {
                field.selector = entry.selector;
            }
            fields.push(field);
        }

        return fields;
    }

    private buildRenameFields(itemIndex: number): AiParserRenameField[] {
        const raw = this.n8n.getNodeParameter('aiParserRenameFields', itemIndex, {}) as RenameFieldCollection;
        const entries = raw.field ?? [];
        const renameFields: AiParserRenameField[] = [];

        for (const entry of entries) {
            if (!entry.name || !entry.new_name) {
                continue;
            }
            renameFields.push({ name: entry.name, new_name: entry.new_name });
        }

        return renameFields;
    }

    async createParser(itemIndex: number): Promise<AiParserResponse> {
        const apiKey = await this.getApiKey();
        const name = this.n8n.getNodeParameter('aiParserName', itemIndex) as string;
        const urls = (this.n8n.getNodeParameter('aiParserUrls', itemIndex, []) as string[]).filter(
            (url) => url && url.trim() !== '',
        );

        if (urls.length === 0) {
            throw new NodeOperationError(this.n8n.getNode(), 'At least one example URL is required');
        }
        if (urls.length > 3) {
            throw new NodeOperationError(this.n8n.getNode(), 'A maximum of 3 example URLs is allowed');
        }

        const body: CreateParserBody = {
            name,
            api_key: apiKey,
            urls,
        };

        const scraperParams = this.buildScraperParams(itemIndex);
        if (Object.keys(scraperParams).length > 0) {
            body.scraper_params = scraperParams;
        }

        const fields = this.buildFields('aiParserCreateFields', itemIndex);
        if (fields.length > 0) {
            body.fields = fields;
        }

        const requestOptions: IHttpRequestOptions = {
            method: 'POST',
            baseURL: AIPARSER_BASE_URL,
            url: '/parsers',
            body,
            returnFullResponse: true,
        };

        return this.n8n.helpers.httpRequest(requestOptions);
    }

    async getParser(itemIndex: number): Promise<AiParserResponse> {
        const apiKey = await this.getApiKey();
        const parserId = this.n8n.getNodeParameter('aiParserId', itemIndex) as string;
        if (!parserId) {
            throw new NodeOperationError(this.n8n.getNode(), 'Parser ID is required');
        }

        const requestOptions: IHttpRequestOptions = {
            method: 'GET',
            baseURL: AIPARSER_BASE_URL,
            url: `/parsers/${encodeURIComponent(parserId)}${this.versionPathSegment(itemIndex)}`,
            qs: { api_key: apiKey },
            returnFullResponse: true,
        };

        return this.n8n.helpers.httpRequest(requestOptions);
    }

    async listParsers(): Promise<AiParserResponse> {
        const apiKey = await this.getApiKey();

        const requestOptions: IHttpRequestOptions = {
            method: 'GET',
            baseURL: AIPARSER_BASE_URL,
            url: '/parsers',
            qs: { api_key: apiKey },
            returnFullResponse: true,
        };

        return this.n8n.helpers.httpRequest(requestOptions);
    }

    async parseUrl(itemIndex: number): Promise<AiParserResponse> {
        const apiKey = await this.getApiKey();
        const parserId = this.n8n.getNodeParameter('aiParserId', itemIndex) as string;
        if (!parserId) {
            throw new NodeOperationError(this.n8n.getNode(), 'Parser ID is required');
        }
        const url = this.n8n.getNodeParameter('aiParserUrl', itemIndex) as string;
        if (!url) {
            throw new NodeOperationError(this.n8n.getNode(), 'URL is required');
        }

        const qs: Record<string, string | number | boolean> = {
            api_key: apiKey,
            url,
            ...this.buildScraperParams(itemIndex),
        };

        const requestOptions: IHttpRequestOptions = {
            method: 'GET',
            baseURL: AIPARSER_BASE_URL,
            url: `/parse/${encodeURIComponent(parserId)}${this.versionPathSegment(itemIndex)}`,
            qs,
            returnFullResponse: true,
        };

        return this.n8n.helpers.httpRequest(requestOptions);
    }

    async updateParser(itemIndex: number): Promise<AiParserResponse> {
        const apiKey = await this.getApiKey();
        const parserId = this.n8n.getNodeParameter('aiParserId', itemIndex) as string;
        if (!parserId) {
            throw new NodeOperationError(this.n8n.getNode(), 'Parser ID is required');
        }

        const body: UpdateParserBody = { api_key: apiKey };

        const addFields = this.buildFields('aiParserAddFields', itemIndex);
        if (addFields.length > 0) {
            body.add_fields = addFields;
        }
        const modifyFields = this.buildFields('aiParserModifyFields', itemIndex);
        if (modifyFields.length > 0) {
            body.modify_fields = modifyFields;
        }
        const renameFields = this.buildRenameFields(itemIndex);
        if (renameFields.length > 0) {
            body.rename_fields = renameFields;
        }
        const removeFields = (this.n8n.getNodeParameter('aiParserRemoveFields', itemIndex, []) as string[]).filter(
            (name) => name && name.trim() !== '',
        );
        if (removeFields.length > 0) {
            body.remove_fields = removeFields;
        }

        if (
            body.add_fields === undefined &&
            body.modify_fields === undefined &&
            body.rename_fields === undefined &&
            body.remove_fields === undefined
        ) {
            throw new NodeOperationError(
                this.n8n.getNode(),
                'At least one of Add Fields, Modify Fields, Rename Fields or Remove Fields must be set',
            );
        }

        const requestOptions: IHttpRequestOptions = {
            method: 'PATCH',
            baseURL: AIPARSER_BASE_URL,
            url: `/parsers/${encodeURIComponent(parserId)}${this.versionPathSegment(itemIndex)}`,
            body,
            returnFullResponse: true,
        };

        return this.n8n.helpers.httpRequest(requestOptions);
    }

    async deleteParser(itemIndex: number): Promise<AiParserResponse> {
        const apiKey = await this.getApiKey();
        const parserId = this.n8n.getNodeParameter('aiParserId', itemIndex) as string;
        if (!parserId) {
            throw new NodeOperationError(this.n8n.getNode(), 'Parser ID is required');
        }

        const requestOptions: IHttpRequestOptions = {
            method: 'DELETE',
            baseURL: AIPARSER_BASE_URL,
            url: `/parsers/${encodeURIComponent(parserId)}`,
            qs: { api_key: apiKey },
            returnFullResponse: true,
        };

        return this.n8n.helpers.httpRequest(requestOptions);
    }

    async executeRequest(itemIndex: number): Promise<AiParserResponse> {
        const operation = this.n8n.getNodeParameter('operation', itemIndex);

        switch (operation) {
            case 'aiParserCreate':
                return this.createParser(itemIndex);
            case 'aiParserGet':
                return this.getParser(itemIndex);
            case 'aiParserList':
                return this.listParsers();
            case 'aiParserParse':
                return this.parseUrl(itemIndex);
            case 'aiParserUpdate':
                return this.updateParser(itemIndex);
            case 'aiParserDelete':
                return this.deleteParser(itemIndex);
            default:
                throw new NodeOperationError(this.n8n.getNode(), `Unknown AI Parser operation: ${operation}`);
        }
    }
}
