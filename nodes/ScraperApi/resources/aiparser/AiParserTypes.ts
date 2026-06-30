export interface AiParserScraperParams {
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

export interface AiParserField {
    name: string;
    description: string;
    type?: 'string' | 'number' | 'array';
    selector?: string;
}

export interface AiParserRenameField {
    name: string;
    new_name: string;
}

export interface CreateParserBody {
    name: string;
    api_key: string;
    urls: string[];
    scraper_params?: AiParserScraperParams;
    fields?: AiParserField[];
}

export interface UpdateParserBody {
    api_key: string;
    add_fields?: AiParserField[];
    modify_fields?: AiParserField[];
    rename_fields?: AiParserRenameField[];
    remove_fields?: string[];
}

interface CreateParserResponseBody {
    id: string;
    version: number;
}

interface ParserListItem {
    id: string;
    name: string;
    version: number;
    status: 'GENERATING' | 'FINISHED' | 'FAILED';
}

interface ParseResultResponseBody {
    parser: string;
    version: number;
    result: unknown;
}

export interface AiParserResponse {
    body: string | CreateParserResponseBody | ParserListItem[] | ParseResultResponseBody | Record<string, unknown>;
    headers: Record<string, string | string[] | undefined>;
    statusCode: number;
    statusMessage: string;
}
