# Security Policy

This package authenticates to a paid SMS gateway and can send messages that cost
real money. Treat its credentials and logs accordingly.

## Handling credentials

- `ILETIMERKEZI_API_KEY` and `ILETIMERKEZI_API_HASH` are secrets. Provide them via
  your MCP client's environment configuration — never commit them. `.env` is
  git-ignored; `.env.example` shows the shape only.
- The server reads credentials once at startup and sends them only to
  `https://api.iletimerkezi.com` over HTTPS, inside the request body.
- Credentials are never written to logs. All diagnostic output goes to **stderr**
  (stdout is reserved for the JSON-RPC stream) and contains no key/hash material.
- Recipient phone numbers are PII. They appear in tool inputs/results by design,
  but are not added to any separate log stream.

## Scope & abuse

- The server exposes the İletiMerkezi account it is configured for. Anyone who can
  invoke the MCP tools can spend SMS credits and message numbers. Restrict who can
  reach the server accordingly.
- Enable an IP allowlist in the İletiMerkezi panel where possible.

## Reporting a vulnerability

Please open a private security advisory on the GitHub repository, or contact the
maintainer via the address on the GitHub profile. Do not file public issues for
sensitive reports. We aim to acknowledge within a few days.
