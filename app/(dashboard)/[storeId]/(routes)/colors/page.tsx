import prismadb from "@/lib/prismadb"
import Client from "./components/client"
import { ColorColumn } from "./components/columns"

import { format } from "date-fns"

export default async function ColorsPage({
  params,
}: {
  params: { storeId: string }
}) {
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const formatedColors: ColorColumn[] = colors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, "MMMM dd, yyyy"),
  }))

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Client data={formatedColors} />
        </div>
      </div>
    </>
  )
}
