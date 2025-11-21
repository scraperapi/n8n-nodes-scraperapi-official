export interface ApiParameters {
	url: string;
    country_code?: string;
    device_type?: string;
    premium?: boolean;
    ultra_premium?: boolean;
    render?: boolean;
}

export interface ApiResponse {
	body: string | object;
	headers: Record<string, string | string[] | undefined>;
	statusCode: number;
	statusMessage: string;
}