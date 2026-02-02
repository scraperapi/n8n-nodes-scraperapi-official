# ScraperAPI Official N8N Node

This is an n8n community node that lets you use **ScraperAPI** in your n8n workflows.

**ScraperAPI** is a solution to help you unlock and scrape any website, no matter the scale or difficulty. It handles proxies, browsers, and CAPTCHAs so you can focus on extracting the data you need.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Table of Contents

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Usage](#usage)
- [Resources](#resources)
- [Parameters](#parameters)
- [Documentation](#documentation)
- [Version History](#version-history)
- [More ScraperAPI Integrations](#more-scraperapi-integrations)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### From the npm registry.

1. Go to Settings > Community Nodes.
2. Select Install.
3. Write [`n8n-nodes-scraperapi-official`](https://www.npmjs.com/package/n8n-nodes-scraperapi-official) in the package name.
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes: select I understand the risks of installing unverified code from a public source.
5. Select Install. n8n installs the node, and returns to the Community Nodes list in Settings.

## Operations

  - API
    - Send a Request
  - Crawler
    - Initiate a crawler job
    - Get a job status
    - Cancel a crawler job

## Credentials

### Getting Your API Key

1. Sign up for a ScraperAPI account at [ScraperAPI Dashboard](https://dashboard.scraperapi.com/signup)
2. Once logged in, navigate to your dashboard
3. Copy your API key from the dashboard

### Configuring Credentials in n8n

1. In your n8n workflow, add a **ScraperAPI** node
2. Click on the **Credential to connect with** field
3. Click **Create New Credential**
4. Enter your API key
5. Click **Save**

The credentials will be automatically tested to ensure they work correctly.

For more information, see the [ScraperAPI API Key Documentation](https://docs.scraperapi.com/dashboard-and-billing/api-key).

## Usage

The ScraperAPI node supports two resources:

- **API**: Scrape a single URL with a GET request. The node handles proxies, browser automation, and CAPTCHA solving.
- **Crawler**: Run multi-page crawler jobs that follow links from a start URL and stream results to a webhook.

1. Add a **ScraperAPI** node to your workflow
2. Select the ScraperAPI resource, for example the **API**
3. Enter the required parameters, for example the **URL** you want to scrape
4. Configure any optional parameter you need
5. Execute the workflow

The node returns a JSON object with the following structure:

```json
{
  "resource": "api",
  "response": {
    "body": "...",
    "headers": {...},
    "statusCode": 200,
    "statusMessage": "OK"
  }
}
```

## Resources

### API

The **API** resource allows you to scrape any website using ScraperAPI's endpoint. It supports:

- JavaScript rendering for dynamic content
- Geo-targeting with country codes
- Device-specific user agents (desktop/mobile)
- Premium and ultra-premium proxy options
- Automatic parsing of structured data for select websites
- Multiple output formats (markdown, text, CSV, JSON)

#### Parameters

#### Required Parameters

- **URL**: The target URL to scrape (e.g., `https://example.com`)

#### Optional Parameters

- **Autoparse**: Whether to activate auto parsing for select websites. When enabled, ScraperAPI will automatically parse structured data from supported websites (JSON format by default).
- **Country Code**: Two-letter ISO country code (e.g., `US`, `GB`, `DE`) for geo-targeted scraping.
- **Desktop Device**: Whether to scrape the page as a desktop device. **Note**: Cannot be combined with Mobile Device.
- **Mobile Device**: Whether to scrape the page as a mobile device. **Note**: Cannot be combined with Desktop Device.
- **Output Format**: Output parsing format for the scraped content. Available options:
  - **Markdown**: Returns content in Markdown format.
  - **Text**: Returns content as plain text.
  - **CSV**: Returns content in CSV format. **Note**: Only available for autoparse websites.
  - **JSON**: Returns content in JSON format. **Note**: Only available for autoparse websites.

  If not specified, the content will be returned as HTML.
- **Render**: Enable JavaScript rendering for pages that require JavaScript to load content. Set to `true` only when needed, as it increases processing time.
- **Premium**: Use premium residential/mobile proxies for higher success rates. This option costs more but provides better reliability. **Note**: Cannot be combined with Ultra Premium.
- **Ultra Premium**: Activate advanced bypass mechanisms for the most difficult websites. This is the most powerful option for sites with advanced anti-bot protection. **Note**: Cannot be combined with Premium.

### Crawler

The **Crawler** resource uses the [ScraperAPI Crawler API](https://docs.scraperapi.com/scraperapi-crawler-v2.0/crawler-api/job-lifecycle) to run crawling jobs to discover and scrapes multiple pages, streaming results to a webhook you provide.

#### Crawler Operations

- **Initiate a Crawler Job**: Create and start a new crawler job. You receive a `jobId` to track or cancel the job.
- **Get a Job Status**: Check the current state of a job.
- **Cancel a Crawler Job**: Stop a running job.

#### Required Parameters

- Initiate a Crawler Job
  - **Start URL**: The URL where crawling begins (depth 0).
  - **Max Depth** or **Crawl Budget**: You must set one of these. **Max Depth** is the maximum depth level (start URL = 0). **Crawl Budget** is the maximum ScraperAPI credits the job may consume.
  - **Regular Expression for URLs**: Regex used to decide which links to crawl from each page. Use `.*` to allow all pages on the site. Use [regex101](https://regex101.com/) for testing.
  - **Callback URL**: Webhook URL where ScraperAPI sends results. Both successful and failed scrape attempts are streamed here; when the job finishes, a job summary is also sent.
- Get Status / Cancel
  - **Job ID**: The crawler job ID returned when you initiated the job.

#### Optional Parameters

- Initiate a Crawler Job
  - **Regular Expression for URLs EXCLUDED**: Regex to skip URLs (e.g. `.*/product/.*`). Leave empty to crawl all URLs that pass the include regex.
  - **API Parameters**: Per-page scrape settings (country code, device, render, premium, output format, etc.). Supported options are documented above in the API resource.
  - **Enabled**: When `true`, the crawler runs according to the schedule. When `false`, only the crawler configuration is created; the job does not run. Defaults to `true`.
  - **Schedule Name**: Name for the crawler (e.g. for the dashboard).
  - **Schedule Interval**: When the crawler runs: `once`, `hourly`, `daily`, `weekly`, or `monthly`.

## Documentation

- [ScraperAPI Official Documentation](https://docs.scraperapi.com)

## Version History

- **0.1.1**: Initial release with API resource support
- **0.1.2**: Usage added to Documentation
- **0.2.0**: Replace device_type options field with desktopDevice and mobileDevice boolean fields to support AI model auto-definition.
- **1.0.0**: output_format and autoparse parameters supported.
- **1.1.0**: Crawler resource: initiate crawler jobs, get job status, and cancel jobs.

## More ScraperAPI Integrations

### MCP Server

ScraperAPI also provides an **MCP (Model Context Protocol) server** that enables AI models and agents to scrape websites.

#### Hosted MCP Server

ScraperAPI offers a hosted MCP server that you can use with n8n's [MCP Client Tool](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolmcp/).

**Configuration Steps:**

1. Add an **MCP Client Tool** node to your workflow
2. Configure the following settings:
   - **Endpoint**: `https://mcp.scraperapi.com/mcp`
   - **Server Transport**: `HTTP Streamable`
   - **Authentication**: `Bearer Auth`
   - **Credential for Bearer Auth**: Enter your ScraperAPI API key as a Bearer Token.
   - **Tools to include**: `All` (or select specific tools as needed)

#### Self-Hosted MCP Server

If you prefer to self-host the MCP server, you can find the implementation and setup instructions in the [scraperapi-mcp repository](https://github.com/scraperapi/scraperapi-mcp).