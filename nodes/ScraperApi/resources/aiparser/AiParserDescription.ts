import { INodeProperties } from "n8n-workflow";

export const AiParserOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['aiparser'],
            },
        },
        options: [
            {
                name: 'Create a Parser',
                value: 'aiParserCreate',
                action: 'Create a parser',
            },
            {
                name: 'Delete a Parser',
                value: 'aiParserDelete',
                action: 'Delete a parser',
            },
            {
                name: 'Get a Parser',
                value: 'aiParserGet',
                action: 'Get a parser',
            },
            {
                name: 'List Parsers',
                value: 'aiParserList',
                action: 'List parsers',
            },
            {
                name: 'Parse a URL',
                value: 'aiParserParse',
                action: 'Parse a URL',
            },
            {
                name: 'Update a Parser',
                value: 'aiParserUpdate',
                action: 'Update a parser',
            },
        ],
        default: 'aiParserCreate',
    },
];

// Shared field-definition values used by the create, add and modify field collections.
const parserFieldValues: INodeProperties[] = [
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        required: true,
        description: 'The name of the field to extract (used as the key in the parsed result)',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        required: true,
        description: 'A natural-language description of the data this field should capture. The AI uses this to locate the value on the page.',
    },
    {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: [
            { name: 'String', value: 'string' },
            { name: 'Number', value: 'number' },
            { name: 'Array', value: 'array' },
        ],
        default: 'string',
        description: 'The data type of the extracted value',
    },
    {
        displayName: 'Selector',
        name: 'selector',
        type: 'string',
        default: '',
        description: 'Optional CSS selector to guide extraction. Leave empty to let the AI determine it automatically.',
    },
];

const aiParserScraperParameters: INodeProperties = {
    displayName: 'Scraper Parameters',
    name: 'aiParserScraperParams',
    type: 'collection',
    placeholder: 'Add Parameter',
    default: {},
    displayOptions: { show: { operation: ['aiParserCreate', 'aiParserParse'] } },
    options: [
        {
            displayName: 'Country Code',
            name: 'country_code',
            type: 'string',
            default: '',
            description: 'Two-letter country code for geo-specific scraping (e.g. us, gb, de)',
        },
        {
            displayName: 'Device Type',
            name: 'device_type',
            type: 'options',
            options: [
                { name: 'Desktop', value: 'desktop' },
                { name: 'Mobile', value: 'mobile' },
            ],
            default: 'desktop',
            description: 'Whether to scrape the page as a desktop or mobile device',
        },
        {
            displayName: 'Follow Redirect',
            name: 'follow_redirect',
            type: 'boolean',
            default: true,
            description: 'Whether to follow HTTP redirects when fetching the page',
        },
        {
            displayName: 'Keep Headers',
            name: 'keep_headers',
            type: 'boolean',
            default: false,
            description: 'Whether to keep the original response headers',
        },
        {
            displayName: 'Premium',
            name: 'premium',
            type: 'boolean',
            default: false,
            description: 'Whether to use premium residential/mobile proxies for higher success rate (Can not be combined with Ultra Premium)',
        },
        {
            displayName: 'Render',
            name: 'render',
            type: 'boolean',
            default: false,
            description: 'Whether to enable JavaScript rendering for dynamic content',
        },
        {
            displayName: 'Retry 404',
            name: 'retry_404',
            type: 'boolean',
            default: false,
            description: 'Whether to retry requests that return a 404 status code',
        },
        {
            displayName: 'Session Number',
            name: 'session_number',
            type: 'number',
            default: 0,
            description: 'Reuse the same proxy session by passing an integer. Sessions persist for up to 60 seconds.',
        },
        {
            displayName: 'Ultra Premium',
            name: 'ultra_premium',
            type: 'boolean',
            default: false,
            description: 'Whether to activate advanced bypass mechanisms (Can not be combined with Premium)',
        },
    ],
};

const aiParserParameters: INodeProperties[] = [
    {
        displayName: 'Name',
        name: 'aiParserName',
        type: 'string',
        displayOptions: { show: { operation: ['aiParserCreate'] } },
        default: '',
        required: true,
        description: 'A name to identify the parser',
    },
    {
        displayName: 'Example URLs',
        name: 'aiParserUrls',
        type: 'string',
        typeOptions: { multipleValues: true, multipleValueButtonText: 'Add URL' },
        displayOptions: { show: { operation: ['aiParserCreate'] } },
        default: [],
        required: true,
        description: 'One to three example URLs of pages with the same structure (max 3). The AI uses these to learn how to extract the fields.',
    },
    {
        displayName: 'Fields',
        name: 'aiParserCreateFields',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { operation: ['aiParserCreate'] } },
        description: 'Optional list of fields to extract. Leave empty to let the AI infer the fields automatically.',
        options: [
            {
                displayName: 'Field',
                name: 'field',
                values: parserFieldValues,
            },
        ],
    },
    aiParserScraperParameters,
    {
        displayName: 'Parser ID',
        name: 'aiParserId',
        type: 'string',
        displayOptions: {
            show: { operation: ['aiParserGet', 'aiParserParse', 'aiParserUpdate', 'aiParserDelete'] },
        },
        default: '',
        required: true,
        description: 'The ID of the parser returned when it was created',
    },
    {
        displayName: 'Version',
        name: 'aiParserVersion',
        type: 'number',
        typeOptions: { minValue: -1 },
        displayOptions: { show: { operation: ['aiParserGet', 'aiParserParse', 'aiParserUpdate'] } },
        default: -1,
        description: 'The specific parser version to target. Leave as -1 to use the latest version. A new parser starts at version 0; use Get a Parser or List Parsers to find available versions.',
    },
    {
        displayName: 'URL',
        name: 'aiParserUrl',
        type: 'string',
        displayOptions: { show: { operation: ['aiParserParse'] } },
        default: '',
        required: true,
        description: 'The target URL to scrape and parse using this parser',
    },
    {
        displayName: 'Add Fields',
        name: 'aiParserAddFields',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { operation: ['aiParserUpdate'] } },
        description: 'Fields to add to the parser. Adding or modifying fields triggers a new parser version to be generated.',
        options: [
            {
                displayName: 'Field',
                name: 'field',
                values: parserFieldValues,
            },
        ],
    },
    {
        displayName: 'Modify Fields',
        name: 'aiParserModifyFields',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { operation: ['aiParserUpdate'] } },
        description: 'Existing fields to redefine. Adding or modifying fields triggers a new parser version to be generated.',
        options: [
            {
                displayName: 'Field',
                name: 'field',
                values: parserFieldValues,
            },
        ],
    },
    {
        displayName: 'Rename Fields',
        name: 'aiParserRenameFields',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { operation: ['aiParserUpdate'] } },
        description: 'Rename existing fields without regenerating the parser',
        options: [
            {
                displayName: 'Field',
                name: 'field',
                values: [
                    {
                        displayName: 'Name',
                        name: 'name',
                        type: 'string',
                        default: '',
                        required: true,
                        description: 'The current name of the field',
                    },
                    {
                        displayName: 'New Name',
                        name: 'new_name',
                        type: 'string',
                        default: '',
                        required: true,
                        description: 'The new name for the field',
                    },
                ],
            },
        ],
    },
    {
        displayName: 'Remove Fields',
        name: 'aiParserRemoveFields',
        type: 'string',
        typeOptions: { multipleValues: true, multipleValueButtonText: 'Add Field' },
        displayOptions: { show: { operation: ['aiParserUpdate'] } },
        default: [],
        description: 'Names of fields to remove from the parser',
    },
];

export const AiParserFields: INodeProperties[] = [...aiParserParameters];
