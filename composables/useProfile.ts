import { getProfile, isLocale } from "~/data/profile";

/** Profile content in the visitor's current language. */
export function useProfile() {
  const { locale } = useI18n();
  return computed(() => getProfile(isLocale(locale.value) ? locale.value : "en"));
}
