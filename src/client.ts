import * as crypto from "node:crypto";

const BASE_URL = "https://api.iletimerkezi.com/v1";
const TIMEOUT = 15_000;

export class IletiMerkeziClient {
  private apiKey: string;
  private secret: string;

  constructor() {
    this.apiKey = process.env.ILETI_API_KEY ?? "";
    this.secret = process.env.ILETI_SECRET ?? "";
    if (!this.apiKey || !this.secret) {
      throw new Error(
        "Environment variables ILETI_API_KEY and ILETI_SECRET are required. " +
        "Get your credentials at https://www.iletimerkezi.com/"
      );
    }
  }

  private generateHash(): string {
    const timestamp = new Date().toISOString();
    const hashStr = this.apiKey + this.secret + timestamp;
    return crypto.createHash("sha256").update(hashStr, "utf8").digest("hex");
  }

  async request(method: string, path: string, body?: unknown): Promise<unknown> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);
    const hash = this.generateHash();

    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-API-Key": this.apiKey,
          "X-API-Hash": hash,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`IletiMerkezi HTTP ${response.status}: ${text}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("IletiMerkezi: request timeout (15s). Try again later.");
      }
      throw error;
    }
  }
}
