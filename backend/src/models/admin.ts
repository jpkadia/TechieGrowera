import mongoose, { Schema } from 'mongoose';
const sessionSchema = new Schema(
  {
    tokenHash: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    credentialVersion: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    lastSeenAt: { type: Date, required: true },
  },
  { timestamps: true },
);
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const logSchema = new Schema(
  {
    actor: { type: String, required: true },
    action: { type: String, required: true },
    target: String,
    outcome: { type: String, enum: ['success', 'failure'], required: true },
    ipHash: String,
    // Deliberately exclude passwords, session tokens, content bodies and lead PII.
    detail: String,
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false },
);
logSchema.index({ createdAt: -1 });
logSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const AdminSession =
  mongoose.models.AdminSession || mongoose.model('AdminSession', sessionSchema);
export const AdminAuditLog =
  mongoose.models.AdminAuditLog || mongoose.model('AdminAuditLog', logSchema);
