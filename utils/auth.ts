import type { SupabaseClient } from "@supabase/supabase-js";

export const USER_CACHE_KEY = "studyhub_auth_user";
export const SUBSCRIPTION_CACHE_KEY = "studyhub_isSubscribed";

const isBrowser = typeof window !== "undefined";

export const getCachedUser = () => {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(USER_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getCachedSubscription = () => {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(SUBSCRIPTION_CACHE_KEY);
    return raw !== null ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const cacheAuthState = (user: any, isSubscribed: boolean) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    window.localStorage.setItem(SUBSCRIPTION_CACHE_KEY, JSON.stringify(isSubscribed));
  } catch {
    // ignore localStorage failures
  }
};

export const clearAuthCache = () => {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(USER_CACHE_KEY);
    window.localStorage.removeItem(SUBSCRIPTION_CACHE_KEY);
  } catch {
    // ignore localStorage failures
  }
};

export const fetchAndCacheAuthState = async (supabase: SupabaseClient) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      clearAuthCache();
      return { user: null, isSubscribed: false };
    }

    const { data: subscriptionData, error: subError } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("id", user.id)
      .single();

    const isSubscribed = Boolean(subscriptionData?.status === "active");
    cacheAuthState(user, isSubscribed);
    return { user, isSubscribed };
  } catch (error) {
    clearAuthCache();
    return { user: null, isSubscribed: false };
  }
};
