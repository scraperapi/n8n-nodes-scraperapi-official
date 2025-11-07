# ScraperAPI Official N8N Node

This is an n8n community node that lets you use **ScraperAPI** in your n8n workflows.

**ScraperAPI** is a solution to help you unlock and scrape any website, no matter the scale or difficulty. It handles proxies, browsers, and CAPTCHAs so you can focus on extracting the data you need.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Table of Contents

- [Installation](#installation)
- [Credentials](#credentials)
- [Usage](#usage)
- [Resources](#resources)
- [Parameters](#parameters)
- [Example Workflows](#example-workflows)
- [Documentation](#documentation)
- [Version History](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

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

The ScraperAPI node allows you to scrape any website by making a simple GET request. The node handles all the complexity of proxies, browser automation, and CAPTCHA solving.

### Basic Usage

1. Add a **ScraperAPI** node to your workflow
2. Select the **API** resource
3. Enter the **URL** you want to scrape
4. Configure any optional parameters (see [Parameters](#parameters) below)
5. Execute the workflow

The node returns the scraped content.

## Resources

### API Endpoint

The **API** resource allows you to scrape any website using ScraperAPI's endpoint. It supports:

- JavaScript rendering for dynamic content
- Geo-targeting with country codes
- Device-specific user agents (desktop/mobile)
- Premium and ultra-premium proxy options
- Automatic parsing of structured data for select websites

#### Parameters

#### Required Parameters

- **URL**: The target URL to scrape (e.g., `https://example.com`)

#### Optional Parameters

- **Country Code**: Two-letter ISO country code (e.g., `US`, `GB`, `DE`) for geo-targeted scraping.

- **Device Type**: Choose the device type to scrape the page as:
  - `Desktop`: Standard desktop browser user agent
  - `Mobile`: Mobile device user agent

- **Render**: Enable JavaScript rendering for pages that require JavaScript to load content. Set to `true` only when needed, as it increases processing time.

- **Premium**: Use premium residential/mobile proxies for higher success rates. This option costs more but provides better reliability. **Note**: Cannot be combined with Ultra Premium.

- **Ultra Premium**: Activate advanced bypass mechanisms for the most difficult websites. This is the most powerful option for sites with advanced anti-bot protection. **Note**: Cannot be combined with Premium.

## Documentation

- [ScraperAPI Official Documentation](https://docs.scraperapi.com)

## Version History

- **0.1.1**: Initial release with API resource support
- **0.1.2**: Usage added to Documentation
