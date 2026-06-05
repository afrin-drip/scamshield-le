# ScamShield LE API

Law Enforcement Data Sharing API — provides authenticated, anonymized access to ScamShield scam incident data for law enforcement agencies.

## Overview

This API aggregates anonymized scam call incident data from ScamShield users and exposes it to vetted law enforcement agencies via JWT-authenticated REST endpoints. **No PII is exposed** — all phone numbers are reduced to area codes, user IDs are removed, and transcripts are truncated to 100-character excerpts.

---

## Authentication

All endpoints (except `/health`) require a valid JWT in the `Authorization` header:

```
Authorization: Bearer <your-agency-jwt>
```

### How to get credentials

1. Contact the ScamShield team at **le@scamshield.app** with your agency name, jurisdiction, and a contact email.
2. Once vetted, call the registration endpoint:

```bash
curl -X POST https://api.scamshield.app/api/v1/agencies/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Federal Trade Commission",
    "agencyCode": "ftc",
    "jurisdiction": "Federal",
    "contactEmail": "le-liaison@ftc.gov",
    "adminSecret": "<provided-by-scamshield>"
  }'
```

Response:
```json
{
  "message": "Agency registered successfully",
  "agencyId": "abc123",
  "agencyCode": "ftc",
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "expiresIn": "24h"
}
```

Tokens expire after 24 hours. Re-register to obtain a new token.

---

## Rate Limits

| Scope | Limit |
|-------|-------|
| Global (per IP) | 100 requests / 15 minutes |
| Per agency | 500 requests / hour |

---

## Endpoints

### Health

```
GET /health
```

No authentication required. Returns service status.

---

### Incidents

#### List incidents (paginated)

```
GET /api/v1/incidents
```

Query parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 100 | Max 1000 |
| `offset` | number | 0 | Pagination offset |
| `startDate` | ISO 8601 | — | Filter by date range |
| `endDate` | ISO 8601 | — | Filter by date range |
| `minRiskScore` | 0–100 | — | Minimum risk score |
| `riskLevel` | LOW/MEDIUM/HIGH/CRITICAL | — | Filter by risk level |
| `areaCode` | 3 digits | — | Filter by area code |
| `signal` | string | — | Filter by scam signal type |

Response:
```json
{
  "data": [
    {
      "id": "inc_3f9a2b",
      "timestamp": "2024-03-15T14:23:11.000Z",
      "riskScore": 94,
      "riskLevel": "CRITICAL",
      "signals": ["irs_impersonation", "gift_card_demand"],
      "transcriptExcerpt": "This is the IRS. You have an outstanding warrant...",
      "areaCode": "202",
      "state": "DC"
    }
  ],
  "pagination": { "limit": 100, "offset": 0, "total": 4821, "hasMore": true }
}
```

#### Incidents by area code

```
GET /api/v1/incidents/by-area-code/:areaCode
```

Example: `GET /api/v1/incidents/by-area-code/212`

#### Incidents by signal type

```
GET /api/v1/incidents/by-signal?days=30
```

#### CSV Export

```
GET /api/v1/incidents/export
```

Returns a CSV file suitable for import into analysis tools (Excel, SPSS, R, etc.). Columns: id, timestamp, riskScore, riskLevel, areaCode, state, signals, transcriptExcerpt.

---

### Patterns

#### Trending scam signals

```
GET /api/v1/patterns/trending?days=7
```

Supported `days` values: 7, 14, 30, 90.

#### Script clusters

```
GET /api/v1/patterns/scripts
```

Clusters incidents by keyword patterns in transcript excerpts. Useful for identifying coordinated scam campaigns.

#### Top area codes by volume

```
GET /api/v1/patterns/area-codes?limit=25
```

#### Peak call hours

```
GET /api/v1/patterns/peak-hours
```

Returns incident distribution by hour of day (UTC).

---

### Statistics

#### Summary stats

```
GET /api/v1/stats/summary
```

Returns: total incidents, unique area codes, average risk score, count by risk level.

#### Weekly trend

```
GET /api/v1/stats/weekly?weeks=8
```

Week-over-week data: incident count, average risk score, critical count, change %.

#### By US state

```
GET /api/v1/stats/by-state
```

Incidents grouped by US state (derived from area code).

---

### Agency Management

#### Register agency

```
POST /api/v1/agencies/register
```

See [Authentication](#authentication) section above.

#### List all agencies (super_admin only)

```
GET /api/v1/agencies/list
```

---

## Data Privacy Guarantees

ScamShield LE API is designed with privacy-by-design principles:

**What IS shared:**
- Anonymized incident timestamps
- Risk scores (0–100) and risk level classifications
- Scam signal types (e.g., `irs_impersonation`, `gift_card_demand`)
- First 100 characters of call transcript (no names, no account numbers)
- Area codes (3-digit, never full phone numbers)
- US state derived from area code

**What is NEVER shared:**
- User IDs or device identifiers
- Full phone numbers
- Names or contact information
- Account numbers or financial details
- Full transcripts
- IP addresses or location data beyond area code

All IDs returned by the API are one-way anonymized hashes of internal record IDs and cannot be reversed to identify individuals.

---

## Deployment

### Google Cloud Run (recommended)

Prerequisites: `gcloud` CLI authenticated, Docker.

```bash
# Clone the repo
git clone https://github.com/afrin-drip/scamshield-le.git
cd scamshield-le/api

# Copy and fill in environment
cp .env.example .env

# Store secrets in Google Secret Manager
gcloud secrets create scamshield-le-api-secret --data-file=<(echo -n "$LE_API_SECRET")
gcloud secrets create scamshield-firebase-private-key --data-file=<(echo -n "$FIREBASE_PRIVATE_KEY")
# ... (repeat for other secrets)

# Deploy
chmod +x deploy-cloudrun.sh
./deploy-cloudrun.sh your-gcp-project-id us-central1
```

### Local development

```bash
cd api
cp .env.example .env  # fill in real values
npm install
npm run dev
```

### Docker

```bash
cd api
docker build -t scamshield-le-api .
docker run -p 3000:3000 --env-file .env scamshield-le-api
```

---

## Error Responses

All errors follow the format:

```json
{ "error": "Human-readable description" }
```

| Status | Meaning |
|--------|---------|
| 400 | Bad request / invalid parameters |
| 401 | Missing or invalid JWT |
| 403 | Valid JWT but insufficient permissions |
| 404 | Endpoint not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## Support

For agency onboarding, technical issues, or data questions: **le@scamshield.app**
