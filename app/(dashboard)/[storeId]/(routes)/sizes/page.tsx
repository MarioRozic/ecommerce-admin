import prismadb from "@/lib/prismadb"
import Client from "./components/client"
import { SizeColumn } from "./components/columns"

import { format } from "date-fns"

export default async function SizesPage({
  params,
}: {
  params: { storeId: string }
}) {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const formatedSizes: SizeColumn[] = sizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, "MMMM dd, yyyy"),
  }))

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Client data={formatedSizes} />
        </div>
      </div>
    </>
  )
}
