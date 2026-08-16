import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  const sessionToken =
    cookieStore.get(
      "workshop_session",
    )?.value;

  const authenticated =
    await isAuthenticated(
      sessionToken,
    );

  if (!authenticated) {
    redirect("/login");
  }

  return children;
}