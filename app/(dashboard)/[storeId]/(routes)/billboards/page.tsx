import prismadb from "@/lib/prismadb"
import Client from "./components/client"
import { BillboardColumn } from "./components/columns"

import { format } from "date-fns"

export default async function BillboardsPage({
  params,
}: {
  params: { storeId: string }
}) {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const formatedBillboards: BillboardColumn[] = billboards.map((billboard) => ({
    id: billboard.id,
    label: billboard.label,
    createdAt: format(billboard.createdAt, "MMMM dd, yyyy"),
  }))

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Client data={formatedBillboards} />
        </div>
      </div>
    </>
  )
}
