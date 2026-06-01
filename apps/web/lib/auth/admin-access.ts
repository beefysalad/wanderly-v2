const ADMIN_ROLES = new Set(["admin", "org:admin"])

type ClaimRecord = Record<string, unknown>

function isRecord(value: unknown): value is ClaimRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function hasAdminRole(value: unknown): boolean {
  return typeof value === "string" && ADMIN_ROLES.has(value)
}

function hasAdminMetadata(claims: ClaimRecord): boolean {
  const metadataClaims = [
    claims.metadata,
    claims.public_metadata,
    claims.publicMetadata,
  ]

  return metadataClaims.some((metadata) => {
    if (!isRecord(metadata)) return false

    return metadata.admin === true || hasAdminRole(metadata.role)
  })
}

function hasAdminAccess(claims: ClaimRecord | null | undefined): boolean {
  if (!claims) return false

  return (
    claims.admin === true ||
    hasAdminRole(claims.role) ||
    hasAdminRole(claims.org_role) ||
    hasAdminMetadata(claims)
  )
}

export { hasAdminAccess }
