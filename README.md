# Caching Proxy Server

This is a CLI-based caching proxy server that forwards requests to an origin server and caches the responses. If the same request is made again, the cached response is returned instead of forwarding the request to the origin server.

## Features

- **Forward Requests**: Forwards requests to the specified origin server.
- **Caching**: Caches responses to minimize repeated requests to the origin server.
- **Cache Headers**: Adds headers to indicate cache status:
  - `X-Cache: HIT` – Response served from cache.
  - `X-Cache: MISS` – Response fetched from the origin server.
- **Clear Cache**: Provides a command to clear the cached data.

## Getting Started

### Prerequisites

- Ensure you have Node.js and npm installed.
- Install dependencies with `npm install`.

### Running the Caching Proxy Server

Before using the proxy, you need to have redis installed on your machine.
If you have docker install then inside of the project directory, run the following command:

```bash
docker compose up -d
```

To start the caching proxy server, use the following command:

```bash
npm start -- --port <number> --origin <url>
```

To clear the cache, use the following command:

```bash
npm start -- --clear-cache
```
