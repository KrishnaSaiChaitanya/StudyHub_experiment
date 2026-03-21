import { StudentTypeProvider } from "@/components/StudentTypeProvider";
import { SubscriptionProvider } from "@/components/SubscriptionProvider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubscriptionProvider>
      <StudentTypeProvider>
        {children}
      </StudentTypeProvider>
    </SubscriptionProvider>
  );
}
