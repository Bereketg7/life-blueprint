// HIPAA compliance utilities – data encryption and privacy
// NOTE: This is a stub. Production implementation requires platform-specific
// encryption libraries (e.g., react-native-keychain, expo-secure-store).

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  algorithm: string;
}

export function sanitisePHI(data: Record<string, any>): Record<string, any> {
  const PHI_FIELDS = ['name', 'email', 'dateOfBirth', 'ssn', 'phone', 'address'];
  const sanitised = { ...data };
  PHI_FIELDS.forEach((field) => {
    if (field in sanitised) {
      sanitised[field] = '[REDACTED]';
    }
  });
  return sanitised;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '[REDACTED]';
  const visible = local.slice(0, 2);
  return `${visible}${'*'.repeat(local.length - 2)}@${domain}`;
}

export function generateAuditLogEntry(
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string
): { timestamp: string; userId: string; action: string; resource: string } {
  return {
    timestamp: new Date().toISOString(),
    userId,
    action,
    resource: `${resourceType}/${resourceId}`,
  };
}

export function isDataSharingConsented(
  permissions: Record<string, boolean>,
  dataType: string
): boolean {
  return permissions[dataType] === true;
}

export function encryptStub(plaintext: string): EncryptedData {
  // Stub: real implementation uses AES-256 via a native crypto module
  return {
    ciphertext: Buffer.from(plaintext).toString('base64'),
    iv: '0000000000000000',
    algorithm: 'AES-256-GCM',
  };
}

export function decryptStub(encrypted: EncryptedData): string {
  // Stub: real implementation decrypts using native crypto module
  return Buffer.from(encrypted.ciphertext, 'base64').toString('utf-8');
}
