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

1. In n8n, go to the **Nodes** panel.
2. Search for **ScraperAPI**.
3. Select **Install**: n8n installs the node and it becomes available in your workflows.

## Operations

  - API
    - Send a Request
  - Structured Data Endpoints (SDEs)
    - Amazon
      - Product
      - Search
      - Offers
      - Review
      - Prices
    - Google
      - Search
      - Jobs
      - News
      - Shopping
      - Maps Search
    - Ebay
      - Search
      - Product
    - Walmart
      - Search
      - Category
      - Product
      - Review
    - Redfin
      - For Sale
      - For Rent
      - Search
      - Agent
  - Crawler
    - Initiate a crawler job
    - Get a job status
    - Cancel a crawler job
  - AI Parser
    - Create a parser
    - Get a parser
    - List parsers
    - Parse a URL
    - Update a parser
    - Delete a parser

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

The ScraperAPI node supports four resources:

- **API**: Scrape a single URL with a GET request. The node handles proxies, browser automation, and CAPTCHA solving.
- **Structured Data Endpoint**: Extract structured data from popular websites (Amazon, Google, eBay, Walmart, Redfin) using purpose-built endpoints that return clean, parsed JSON.
- **Crawler**: Run multi-page crawler jobs that follow links from a start URL and stream results to a webhook.
- **AI Parser**: Build a reusable AI-powered parser from a few example URLs, then apply it to extract structured JSON from any page with the same layout.

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

The **API** resource allows you to scrape any website using ScraperAPI's endpoint. It supports JavaScript rendering, geo-targeting, device-specific user agents, premium proxies, automatic parsing, and multiple output formats.

<details>
<summary><strong>Send a Request</strong></summary>

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `url` | string | Target URL to scrape (e.g., `https://example.com`) | Yes |
| `render` | boolean | Enable JavaScript rendering for dynamic content (default: `false`) | No |
| `countryCode` | string | Two-letter ISO country code (e.g., `US`, `GB`, `DE`) for geo-targeted scraping | No |
| `desktopDevice` | boolean | Scrape the page as a desktop device (incompatible with `mobileDevice`) | No |
| `mobileDevice` | boolean | Scrape the page as a mobile device (incompatible with `desktopDevice`) | No |
| `outputFormat` | string | Output format: `'markdown'`, `'text'`, `'csv'`, or `'json'`. CSV and JSON are only available for autoparse websites. Default: HTML | No |
| `autoparse` | boolean | Enable automatic parsing for select websites (default: `false`) | No |
| `premium` | boolean | Use premium residential/mobile proxies for higher success rates (incompatible with `ultraPremium`) | No |
| `ultraPremium` | boolean | Activate advanced bypass mechanisms for the most difficult websites (incompatible with `premium`) | No |
| `zipCode` | string | US ZIP code for Amazon location-specific results (Amazon US only, e.g., `92223`) | No |

</details>

### Crawler

The **Crawler** resource uses the [ScraperAPI Crawler API](https://docs.scraperapi.com/scraperapi-crawler-v2.0/crawler-api/job-lifecycle) to run crawling jobs to discover and scrape multiple pages, streaming results to a webhook you provide.

<details>
<summary><strong>Initiate a Crawler Job</strong></summary>

Create and start a new crawler job. You receive a `jobId` to track or cancel the job.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `startUrl` | string | The URL where crawling begins (depth 0) | Yes |
| `maxDepth` | number | Maximum depth level (start URL = 0). Either `maxDepth` or `crawlBudget` must be set | Yes* |
| `crawlBudget` | number | Maximum ScraperAPI credits the job may consume. Either `maxDepth` or `crawlBudget` must be set | Yes* |
| `urlRegexpInclude` | string | Regex to decide which links to crawl from each page. Use `.*` to allow all pages on the site | Yes |
| `callbackUrl` | string | Webhook URL where ScraperAPI sends results. Both successful and failed scrape attempts are streamed here; when the job finishes, a job summary is also sent | Yes |
| `urlRegexpExclude` | string | Regex to skip URLs (e.g., `.*/product/.*`). Leave empty to crawl all URLs that pass the include regex | No |
| `apiParameters` | object | Per-page scrape settings (country code, device, render, premium, output format, etc.). See the API resource for supported options | No |
| `enabled` | boolean | When `true`, the crawler runs according to the schedule. When `false`, only the configuration is created (default: `true`) | No |
| `scheduleName` | string | Name for the crawler (e.g., for the dashboard) | No |
| `scheduleInterval` | string | When the crawler runs: `'once'`, `'hourly'`, `'daily'`, `'weekly'`, or `'monthly'` | No |

</details>

<details>
<summary><strong>Get a Job Status</strong></summary>

Check the current state of a crawler job.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `jobId` | string | The crawler job ID returned when you initiated the job | Yes |

</details>

<details>
<summary><strong>Cancel a Crawler Job</strong></summary>

Stop a running crawler job.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `jobId` | string | The crawler job ID returned when you initiated the job | Yes |

</details>

### AI Parser

The **AI Parser** resource uses the [ScraperAPI AI Parser](https://docs.scraperapi.com/ai-parser) to generate a reusable parser from a handful of example URLs. Once a parser finishes generating, you can apply it to any page that shares the same layout to extract clean, structured JSON. All AI Parser operations are accessed via `https://aiparser.scraperapi.com`.

<details>
<summary><strong>Create a Parser</strong></summary>

Create a new parser from example URLs. The parser is generated asynchronously; you receive an `id` and `version` to track its status. Use **Get a Parser** to check when generation has finished.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `name` | string | A name to identify the parser | Yes |
| `urls` | string[] | One to three example URLs of pages with the same structure (max 3). The AI uses these to learn how to extract the fields. | Yes |
| `fields` | collection | Optional list of fields to extract (`name`, `description`, `type`, `selector`). Leave empty to let the AI infer the fields automatically. | No |
| `scraperParams` | object | Optional scrape settings applied when fetching the example pages (see below) | No |

</details>

<details>
<summary><strong>Get a Parser</strong></summary>

Retrieve a parser's details, including its generation status (`GENERATING`, `FINISHED`, or `FAILED`), its fields, and example results.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `parserId` | string | The ID of the parser returned when it was created | Yes |

</details>

<details>
<summary><strong>List Parsers</strong></summary>

List all parsers associated with your account. This operation takes no parameters.

</details>

<details>
<summary><strong>Parse a URL</strong></summary>

Apply a finished parser to a target URL and return the extracted structured data.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `parserId` | string | The ID of the parser to apply | Yes |
| `url` | string | The target URL to scrape and parse | Yes |
| `scraperParams` | object | Optional scrape settings applied when fetching the target page (see below) | No |

</details>

<details>
<summary><strong>Update a Parser</strong></summary>

Modify an existing parser's fields. Adding or modifying fields triggers a new parser version to be generated; renaming and removing fields are applied immediately. At least one of the parameters below must be set.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `parserId` | string | The ID of the parser to update | Yes |
| `addFields` | collection | Fields to add (`name`, `description`, `type`, `selector`) | No |
| `modifyFields` | collection | Existing fields to redefine (`name`, `description`, `type`, `selector`) | No |
| `renameFields` | collection | Fields to rename (`name`, `new_name`) | No |
| `removeFields` | string[] | Names of fields to remove | No |

</details>

<details>
<summary><strong>Delete a Parser</strong></summary>

Permanently delete a parser.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `parserId` | string | The ID of the parser to delete | Yes |

</details>

#### Scraper Parameters

The optional `scraperParams` collection (available on **Create a Parser** and **Parse a URL**) controls how ScraperAPI fetches pages:

| Parameter | Type | Description |
|-----------|------|-------------|
| `countryCode` | string | Two-letter country code for geo-specific scraping (e.g. `us`, `gb`, `de`) |
| `deviceType` | string | Scrape as a `desktop` or `mobile` device |
| `followRedirect` | boolean | Whether to follow HTTP redirects |
| `keepHeaders` | boolean | Whether to keep the original response headers |
| `premium` | boolean | Use premium residential/mobile proxies (incompatible with `ultraPremium`) |
| `render` | boolean | Enable JavaScript rendering for dynamic content |
| `retry404` | boolean | Whether to retry requests that return a 404 status code |
| `sessionNumber` | number | Reuse the same proxy session by passing an integer |
| `ultraPremium` | boolean | Activate advanced bypass mechanisms (incompatible with `premium`) |

### Structured Data Endpoints (SDEs)

The **Structured Data Endpoints** resource provides purpose-built endpoints for extracting structured data from popular platforms. Each endpoint returns clean, parsed JSON without requiring manual parsing. All SDE endpoints are accessed via `https://api.scraperapi.com/structured/{platform}/{endpoint}`.

<details>
<summary><strong>Amazon</strong></summary>

#### Amazon Product

Extract detailed product information from Amazon.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `asin` | string | The Amazon Standard Identification Number (e.g., `B08N5WRWNW`) | Yes |
| `tld` | string | Amazon top-level domain (e.g., `com`, `co.uk`, `de`) | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |
| `includeHtml` | boolean | Whether to include raw HTML in the response | No |
| `language` | string | Language code for the response | No |

#### Amazon Search

Search for products on Amazon.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `query` | string | Search query (e.g., `laptop`) | Yes |
| `tld` | string | Amazon top-level domain | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |
| `page` | number | Page number of search results | No |
| `sort` | string | Sort parameter | No |
| `category` | string | Department/category filter | No |
| `language` | string | Language code for the response | No |

#### Amazon Offers

Get all offers (sellers) for a specific Amazon product.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `asin` | string | The Amazon Standard Identification Number | Yes |
| `tld` | string | Amazon top-level domain | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |
| `condition` | string | Filter by item condition | No |
| `filterNew` | boolean | Filter for new items | No |
| `filterUsedGood` | boolean | Filter for used - good condition | No |
| `filterUsedLikeNew` | boolean | Filter for used - like new condition | No |
| `filterUsedVeryGood` | boolean | Filter for used - very good condition | No |
| `filterUsedAcceptable` | boolean | Filter for used - acceptable condition | No |

#### Amazon Review

Get customer reviews for an Amazon product.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `asin` | string | The Amazon Standard Identification Number | Yes |
| `tld` | string | Amazon top-level domain | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |
| `filterByStar` | string | Filter reviews by star rating | No |
| `reviewerType` | string | Filter by reviewer type | No |
| `pageNumber` | number | Page number of reviews | No |
| `sortBy` | string | Sort order for reviews | No |

#### Amazon Prices

Get pricing information for multiple Amazon products at once.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `asins` | string | Comma-separated list of ASINs (max 8) | Yes |
| `tld` | string | Amazon top-level domain | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |

</details>

<details>
<summary><strong>Google</strong></summary>

#### Google Search

Get Google search results.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `query` | string | Search query | Yes |
| `tld` | string | Google top-level domain (e.g., `com`, `co.uk`) | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |
| `dateRangeStart` | string | Start date for date-range filtering | No |
| `dateRangeEnd` | string | End date for date-range filtering | No |
| `timePeriod` | string | Predefined time period filter | No |
| `includeHtml` | boolean | Whether to include raw HTML in the response | No |

#### Google Jobs

Get Google Jobs search results.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `query` | string | Job search query | Yes |
| `tld` | string | Google top-level domain | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |

#### Google News

Get Google News results.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `query` | string | News search query | Yes |
| `tld` | string | Google top-level domain | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |
| `dateRangeStart` | string | Start date for date-range filtering | No |
| `dateRangeEnd` | string | End date for date-range filtering | No |
| `timePeriod` | string | Predefined time period filter | No |

#### Google Shopping

Get Google Shopping results.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `query` | string | Shopping search query | Yes |
| `tld` | string | Google top-level domain | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |
| `includeHtml` | boolean | Whether to include raw HTML in the response | No |

#### Google Maps Search

Search for businesses and places on Google Maps.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `query` | string | Search query (e.g., `pizza near Times Square`) | Yes |
| `tld` | string | Google top-level domain | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |
| `latitude` | string | Latitude for location-based search | No |
| `longitude` | string | Longitude for location-based search | No |
| `zoom` | number | Zoom level for the map search | No |
| `includeHtml` | boolean | Whether to include raw HTML in the response | No |

</details>

<details>
<summary><strong>eBay</strong></summary>

#### eBay Search

Search for items on eBay.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `query` | string | Search query | Yes |
| `tld` | string | eBay top-level domain | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |
| `page` | number | Page number of search results | No |
| `itemsPerPage` | number | Number of items per page | No |
| `sellerId` | string | Filter by specific seller | No |
| `condition` | string | Filter by item condition | No |
| `buyingFormat` | string | Filter by buying format: `'buy_it_now'`, `'auction'`, `'accepts_offers'` | No |
| `showOnly` | string | Additional filters: `'returns_accepted'`, `'authorized_seller'`, `'completed_items'`, `'sold_items'`, `'sale_items'`, `'listed_as_lots'`, `'search_in_description'`, `'benefits_charity'`, `'authenticity_guarantee'` | No |
| `sortBy` | string | Sort order: `'ending_soonest'`, `'newly_listed'`, `'price_lowest'`, `'price_highest'`, `'distance_nearest'`, `'best_match'` | No |

#### eBay Product

Get detailed product information from eBay.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `productId` | string | The eBay product/item ID | Yes |
| `tld` | string | eBay top-level domain | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |

</details>

<details>
<summary><strong>Walmart</strong></summary>

#### Walmart Search

Search for products on Walmart.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `query` | string | Search query | Yes |
| `tld` | string | Walmart top-level domain | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |
| `page` | number | Page number of search results | No |

#### Walmart Category

Browse products by Walmart category.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `category` | string | Walmart category ID | Yes |
| `tld` | string | Walmart top-level domain | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |
| `page` | number | Page number of results | No |

#### Walmart Product

Get detailed product information from Walmart.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `productId` | string | The Walmart product ID | Yes |
| `tld` | string | Walmart top-level domain | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |

#### Walmart Review

Get customer reviews for a Walmart product.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `productId` | string | The Walmart product ID | Yes |
| `tld` | string | Walmart top-level domain | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |
| `page` | number | Page number of reviews | No |
| `sort` | string | Sort order for reviews | No |
| `ratings` | string | Filter by rating | No |
| `verifiedPurchase` | boolean | Filter for verified purchases only | No |

</details>

<details>
<summary><strong>Redfin</strong></summary>

#### Redfin For Sale

Get property listings for sale on Redfin.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `url` | string | Full Redfin URL for the search | Yes |
| `tld` | string | Redfin top-level domain | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |
| `raw` | boolean | Whether to return raw data | No |

#### Redfin For Rent

Get rental property listings on Redfin.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `url` | string | Full Redfin URL for the search | Yes |
| `tld` | string | Redfin top-level domain | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |
| `raw` | boolean | Whether to return raw data | No |

#### Redfin Search

Search for properties on Redfin.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `url` | string | Full Redfin URL for the search | Yes |
| `tld` | string | Redfin top-level domain | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |

#### Redfin Agent

Get real estate agent information from Redfin.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `url` | string | Full Redfin agent URL | Yes |
| `tld` | string | Redfin top-level domain | No |
| `countryCode` | string | Two-letter country code for geo-targeting | No |

</details>

## Documentation

- [ScraperAPI Official Documentation](https://docs.scraperapi.com)

## Version History

- **0.1.1**: Initial release with API resource support
- **0.1.2**: Usage added to Documentation
- **0.2.0**: Replace device_type options field with desktopDevice and mobileDevice boolean fields to support AI model auto-definition.
- **1.0.0**: output_format and autoparse parameters supported.
- **1.1.0**: Crawler resource: initiate crawler jobs, get job status, and cancel jobs.
- **1.2.0**: Structured Data Endpoints (SDEs) resource for Amazon, Google, Walmart, eBay, and Redfin.
- **1.2.1**: Refactor SDE optional parameters into per-operation collections to satisfy the n8n community node validator.
- **1.2.2**: Publish via GitHub Actions with npm provenance attestation; bump `@n8n/node-cli` to `^0.29.1`.
- **1.2.3**: Preserve original error types (e.g. `NodeOperationError`) when `continueOnFail` is off.
- **1.3.0**: AI Parser resource: create, get, list, parse, update, and delete AI-powered parsers. API resource: add the `zipCode` parameter for Amazon location-specific results (Amazon US only).

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
