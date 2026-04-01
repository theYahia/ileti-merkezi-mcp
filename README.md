# ileti-merkezi-mcp

MCP server for Ileti Merkezi SMS API (Turkey). Send SMS, bulk SMS, check delivery reports, manage contacts and blacklists via API Key + Hash authentication.

## Tools (8)

| Tool | Description |
|---|---|
| `send_sms` | Send a single SMS message |
| `send_bulk_sms` | Send SMS to multiple recipients |
| `get_sms_report` | Get delivery report |
| `get_balance` | Get account balance and SMS credits |
| `list_senders` | List approved sender names |
| `create_contact_group` | Create a contact group |
| `add_contacts` | Add contacts to a group |
| `get_blacklist` | Get blacklisted numbers |

## Quick Start

```json
{
  "mcpServers": {
    "ileti-merkezi": {
      "command": "npx",
      "args": ["-y", "@theyahia/ileti-merkezi-mcp"],
      "env": {
        "ILETI_API_KEY": "<YOUR_API_KEY>",
        "ILETI_SECRET": "<YOUR_SECRET>"
      }
    }
  }
}
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ILETI_API_KEY` | Yes | API key from Ileti Merkezi panel |
| `ILETI_SECRET` | Yes | Secret key from Ileti Merkezi |

## Demo Prompts

- "Send an SMS to +905551234567 saying 'Your order is ready'"
- "Send bulk SMS to my VIP customers about the 20% discount"
- "Check delivery report for message msg_001"
- "How many SMS credits do I have left?"
- "List all my approved sender names"
- "Create a new contact group called 'March Campaign'"

## License

MIT
