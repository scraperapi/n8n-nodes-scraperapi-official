import { ApiParameters } from "../api/ApiTypes";

export interface CrawlerParameters {
    start_url: string;
    max_depth?: number;
    crawl_budget?: number;
    url_regexp_include: string; // Use .* to crawl all pages on the site.
    url_regexp_exclude?: string; // Leave empty to include all pages on the site.
    api_params: Omit<ApiParameters, 'url'>;
    enabled?: boolean;
    schedule: {
        name: string;
        interval: 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    };
    callback?: {
        type: 'webhook';
        url: string;
    };
}

type JobStatus = 'delayed' | 'running' | 'completed' | 'failed' | 'cancelled' | 'in delivery' | 'delivered';

interface CreateJobResponseBody {
    status: JobStatus;
    jobId: string;
}

interface DeleteJobResponseBody {
    status: JobStatus;
    message: string;
}
interface JobStatusResponseBody {
    crawler_job_id: string;
    done: string;
    failed: string;
    active: string;
}

export interface CrawlerResponse {
    body: string | CreateJobResponseBody | JobStatusResponseBody | DeleteJobResponseBody;
    headers: Record<string, string | string[] | undefined>;
    statusCode: number;
    statusMessage: string;
}