#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { IletiMerkeziClient } from "./client.js";

const server = new McpServer({ name: "ileti-merkezi-mcp", version: "1.0.0" });

function getClient(): IletiMerkeziClient {
  return new IletiMerkeziClient();
}

server.tool("send_sms", "Send a single SMS message", {
  to: z.string().describe("Recipient phone number (with country code, e.g. +905551234567)"),
  message: z.string().describe("SMS message text"),
  sender: z.string().optional().describe("Sender name/number (must be pre-approved)"),
  schedule_at: z.string().optional().describe("Schedule send time (ISO 8601)"),
}, async (params) => {
  const client = getClient();
  const body: Record<string, unknown> = {
    to: params.to,
    message: params.message,
  };
  if (params.sender) body.sender = params.sender;
  if (params.schedule_at) body.scheduleAt = params.schedule_at;
  const result = await client.request("POST", "/send-sms", body);
  return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
});

server.tool("send_bulk_sms", "Send SMS to multiple recipients", {
  recipients: z.array(z.string()).describe("Array of phone numbers"),
  message: z.string().describe("SMS message text"),
  sender: z.string().optional().describe("Sender name"),
  schedule_at: z.string().optional().describe("Schedule send time (ISO 8601)"),
}, async (params) => {
  const client = getClient();
  const body: Record<string, unknown> = {
    recipients: params.recipients,
    message: params.message,
  };
  if (params.sender) body.sender = params.sender;
  if (params.schedule_at) body.scheduleAt = params.schedule_at;
  const result = await client.request("POST", "/send-bulk-sms", body);
  return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
});

server.tool("get_sms_report", "Get delivery report for a sent SMS", {
  message_id: z.string().optional().describe("Message ID to check"),
  order_id: z.string().optional().describe("Order ID for bulk SMS"),
  page: z.number().int().default(1).describe("Page number"),
  per_page: z.number().int().default(25).describe("Items per page"),
}, async (params) => {
  const client = getClient();
  const qs = new URLSearchParams({ page: String(params.page), perPage: String(params.per_page) });
  if (params.message_id) qs.set("messageId", params.message_id);
  if (params.order_id) qs.set("orderId", params.order_id);
  const result = await client.request("GET", `/reports?${qs}`);
  return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
});

server.tool("get_balance", "Get account balance and SMS credits", {}, async () => {
  const client = getClient();
  const result = await client.request("GET", "/balance");
  return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
});

server.tool("list_senders", "List approved sender names", {}, async () => {
  const client = getClient();
  const result = await client.request("GET", "/senders");
  return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
});

server.tool("create_contact_group", "Create a new contact group", {
  name: z.string().describe("Group name"),
}, async (params) => {
  const client = getClient();
  const result = await client.request("POST", "/contacts/groups", { name: params.name });
  return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
});

server.tool("add_contacts", "Add contacts to a group", {
  group_id: z.string().describe("Contact group ID"),
  contacts: z.array(z.object({
    phone_number: z.string().describe("Phone number with country code"),
    name: z.string().optional().describe("First name"),
    surname: z.string().optional().describe("Last name"),
    email: z.string().optional().describe("Email"),
  })).describe("Contacts to add"),
}, async (params) => {
  const client = getClient();
  const body = {
    contacts: params.contacts.map(c => ({
      phoneNumber: c.phone_number,
      name: c.name,
      surname: c.surname,
      email: c.email,
    })),
  };
  const result = await client.request("POST", `/contacts/groups/${params.group_id}/contacts`, body);
  return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
});

server.tool("get_blacklist", "Get blacklisted phone numbers", {
  page: z.number().int().default(1).describe("Page number"),
  per_page: z.number().int().default(25).describe("Items per page"),
}, async (params) => {
  const client = getClient();
  const qs = new URLSearchParams({ page: String(params.page), perPage: String(params.per_page) });
  const result = await client.request("GET", `/blacklist?${qs}`);
  return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[ileti-merkezi-mcp] Server started. 8 tools available.");
}

main().catch((error) => { console.error("[ileti-merkezi-mcp] Error:", error); process.exit(1); });
