const OLD_SUPABASE_HOSTS = [
  'lxmhpvomiwizlhjsxjli.supabase.co',
];

export function normalizeSupabaseStorageUrl(url: string): string {
  if (!url) {
    return url;
  }

  try {
    const parsed = new URL(url);
    const currentHost = new URL(import.meta.env.VITE_SUPABASE_URL).host;

    if (OLD_SUPABASE_HOSTS.includes(parsed.host)) {
      parsed.host = currentHost;
      return parsed.toString();
    }
  } catch {
    return url;
  }

  return url;
}

export function normalizeSupabaseStorageUrls(urls: string[] = []): string[] {
  return urls.map(normalizeSupabaseStorageUrl);
}
