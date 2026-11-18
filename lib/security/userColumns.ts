/**
 * Colunas seguras de `user_profiles` para uso em Server e Client Components.
 * Nunca inclui `access_code`.
 */
export const USER_PROFILE_SAFE_COLUMNS =
  'id, parish_id, user_id, name, email, phone, role, community_id, status, allowed_modules, last_sign_in_at, invitation_sent_at, created_at, updated_at';
