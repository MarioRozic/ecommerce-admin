import { serverActions } from "@/actions/serverActions";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function SetupLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await serverActions.store.getStore({ userId });

  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
}
