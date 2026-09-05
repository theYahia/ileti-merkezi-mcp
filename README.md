# İleti Merkezi MCP sunucusu — yapay zekâ ile SMS ve toplu SMS gönderimi

İleti Merkezi SMS API'sini Claude'a ya da başka bir yapay zekâ asistanına nasıl bağlayacağınızı, kod yazmadan toplu SMS nasıl göndereceğinizi veya teslimat raporlarını sohbet içinden nasıl okuyacağınızı arıyorsanız — aradığınız şey bu. 8 araç: tekil ve toplu SMS, teslimat raporu, bakiye ve kredi sorgusu, onaylı gönderici adları, rehber grupları ve kara liste. "VIP müşterilerime kampanya SMS'i gönder" yazıyorsunuz, gönderiliyor.

> Send single and bulk SMS through the Ileti Merkezi API (Turkey) from your AI assistant — delivery reports, balance, sender names, contact groups and blacklist included.

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

---

Telegram: [@vhodvai](https://t.me/vhodvai)
