import { serverActions } from "@/actions/serverActions";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children, params }: { children: React.ReactNode; params: { storeId: string } }) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await serverActions.store.getStore(params.storeId, userId);

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <div>This will be a Navbar</div>
      {children}
    </>
  );
}
