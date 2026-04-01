import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
global.fetch = mockFetch;

process.env.ILETI_API_KEY = "test-api-key";
process.env.ILETI_SECRET = "test-secret";

describe("ileti-merkezi-mcp tools", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("IletiMerkeziClient sends API key and hash headers", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ balance: 500, smsCredits: 1000 }),
    });
    const { IletiMerkeziClient } = await import("../client.js");
    const client = new IletiMerkeziClient();
    await client.request("GET", "/balance");
    const call = mockFetch.mock.calls[0];
    expect(call[1].headers["X-API-Key"]).toBe("test-api-key");
    expect(call[1].headers["X-API-Hash"]).toBeDefined();
  });

  it("send_sms sends message body", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: "success", messageId: "msg_001" }),
    });
    const { IletiMerkeziClient } = await import("../client.js");
    const client = new IletiMerkeziClient();
    const result = await client.request("POST", "/send-sms", {
      to: "+905551234567",
      message: "Test SMS",
    }) as any;
    expect(result.messageId).toBe("msg_001");
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.to).toBe("+905551234567");
  });

  it("send_bulk_sms sends recipients array", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: "success", orderId: "ord_001", totalCount: 3, successCount: 3 }),
    });
    const { IletiMerkeziClient } = await import("../client.js");
    const client = new IletiMerkeziClient();
    const result = await client.request("POST", "/send-bulk-sms", {
      recipients: ["+905551111111", "+905552222222", "+905553333333"],
      message: "Bulk test",
    }) as any;
    expect(result.totalCount).toBe(3);
  });

  it("get_balance returns credits", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ balance: 250, smsCredits: 500 }),
    });
    const { IletiMerkeziClient } = await import("../client.js");
    const client = new IletiMerkeziClient();
    const result = await client.request("GET", "/balance") as any;
    expect(result.smsCredits).toBe(500);
  });

  it("list_senders returns sender list", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ senders: [{ id: "s1", name: "MyCompany", status: "active" }] }),
    });
    const { IletiMerkeziClient } = await import("../client.js");
    const client = new IletiMerkeziClient();
    const result = await client.request("GET", "/senders") as any;
    expect(result.senders[0].name).toBe("MyCompany");
  });

  it("handles HTTP errors gracefully", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false, status: 401, text: async () => "Invalid API key",
    });
    const { IletiMerkeziClient } = await import("../client.js");
    const client = new IletiMerkeziClient();
    await expect(client.request("GET", "/balance")).rejects.toThrow("IletiMerkezi HTTP 401");
  });

  it("throws when env vars missing", async () => {
    const orig = process.env.ILETI_API_KEY;
    delete process.env.ILETI_API_KEY;
    const { IletiMerkeziClient } = await import("../client.js");
    expect(() => new IletiMerkeziClient()).toThrow("ILETI_API_KEY");
    process.env.ILETI_API_KEY = orig;
  });
});
