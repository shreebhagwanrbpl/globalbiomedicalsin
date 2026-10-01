# MongoDB-backed Admin API migration

This website does not connect directly to MongoDB. Product/site reads and query writes are
proxied through the central Admin Panel API; MongoDB URI and credentials belong only in
the Admin Panel's server environment.

Set the website server environment variable:
- `ADMIN_API_BASE_URL=https://admin.rajbiosis.app` (replace with your actual Admin Panel URL)
- `NEXT_PUBLIC_WEBSITE_ID=globalbiomedicals.in`
- `NEXT_PUBLIC_COMPANY_ID=global`

The Admin Panel must expose:
- `GET /api/catalog`
- `GET /api/site-data`
- `POST /api/public-query` (accepting `type: "contact"` or `type: "product"`)

The website query routes return an error if the Admin API fails; they do not falsely report a successful submission.
Firebase database SDK modules and old backup pages that directly accessed Firestore have been removed.
