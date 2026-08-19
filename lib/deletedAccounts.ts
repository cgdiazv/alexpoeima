import fs from "fs";
import path from "path";

const DELETED_ACCOUNTS_FILE = path.join(process.cwd(), "lib", "deleted_accounts.json");

function getDeletedEmails(): string[] {
  try {
    if (!fs.existsSync(DELETED_ACCOUNTS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DELETED_ACCOUNTS_FILE, "utf-8");
    return JSON.parse(data) || [];
  } catch (err) {
    console.error("[Deleted Accounts] Error reading file:", err);
    return [];
  }
}

function saveDeletedEmails(emails: string[]): void {
  try {
    const dir = path.dirname(DELETED_ACCOUNTS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DELETED_ACCOUNTS_FILE, JSON.stringify(Array.from(new Set(emails)), null, 2), "utf-8");
  } catch (err) {
    console.error("[Deleted Accounts] Error writing file:", err);
  }
}

export function isAccountDeleted(email: string): boolean {
  if (!email) return false;
  const emails = getDeletedEmails();
  return emails.includes(email.toLowerCase().trim());
}

export function markAccountDeleted(email: string): void {
  if (!email) return;
  const emails = getDeletedEmails();
  const normalized = email.toLowerCase().trim();
  if (!emails.includes(normalized)) {
    emails.push(normalized);
    saveDeletedEmails(emails);
  }
}

export function unmarkAccountDeleted(email: string): void {
  if (!email) return;
  const emails = getDeletedEmails();
  const normalized = email.toLowerCase().trim();
  const filtered = emails.filter((e) => e !== normalized);
  saveDeletedEmails(filtered);
}
