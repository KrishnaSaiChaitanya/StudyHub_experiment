"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { fetchAndCacheAuthState, getCachedSubscription } from "@/utils/auth";

interface SubscriptionContextType {
  isSubscribed: boolean;
  isLoading: boolean;
  checkSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isSubscribed: false,
  isLoading: true,
  checkSubscription: async () => {},
});

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const checkSubscription = async () => {
    setIsLoading(true);
    try {
      const { isSubscribed } = await fetchAndCacheAuthState(supabase);
      setIsSubscribed(isSubscribed);
    } catch (err) {
      console.error("Error checking subscription:", err);
      setIsSubscribed(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cached = getCachedSubscription();
    if (cached !== null) {
      setIsSubscribed(cached);
      setIsLoading(false);
      return;
    }
    checkSubscription();
  }, [supabase.auth]);

  return (
    <SubscriptionContext.Provider value={{ isSubscribed, isLoading, checkSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
