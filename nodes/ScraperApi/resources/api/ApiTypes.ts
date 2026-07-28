export interface ApiParameters {
	url: string;
    country_code?: string;
    device_type?: string;
    premium?: boolean;
    ultra_premium?: boolean;
    render?: boolean;
    output_format?: 'markdown' | 'text' | 'csv' | 'json' | 'html';
    autoparse?: boolean;
    zip?: string;
    session_number?: number;
    keep_headers?: boolean;
    follow_redirect?: boolean;
    retry_404?: boolean;
    instruction_set?: string;
    custom_headers?: Record<string, string>;
    wait_for_selector?: string;
}

export interface ApiResponse {
	body: string | object;
	headers: Record<string, string | string[] | undefined>;
	statusCode: number;
	statusMessage: string;
}