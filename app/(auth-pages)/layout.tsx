import { StudentTypeProvider } from "@/components/StudentTypeProvider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentTypeProvider>
      {children}
    </StudentTypeProvider>
  );
}
