import i18n from '@/i18n';

// The axios response interceptor already unwraps to `error.response.data.error`
// (see src/services/axiosClient.ts), so by the time an error reaches a catch
// block here, `err.code` / `err.message` are the backend's own fields —
// `err.response.data.message` is NOT populated at this point.
//
// Framework-level validation errors (class-validator's ValidationPipe, before
// a request ever reaches application code) don't go through our `{code,
// message}` constants — they carry no `code` and `message` is an array of
// strings instead of one, so those get joined rather than looked up.
export function getApiErrorMessage(err: any): string {
  const code = err?.code;
  if (code && i18n.exists(`errors:${code}`)) {
    return i18n.t(`errors:${code}`);
  }
  if (Array.isArray(err?.message)) {
    return err.message.join(', ');
  }
  return err?.message || i18n.t('common:errors.generic');
}
