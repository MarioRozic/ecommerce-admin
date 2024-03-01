import prismadb from "@/lib/prismadb"
import Client from "./components/client"
import { BillboardColumn } from "./components/columns"

import { format } from "date-fns"

export default async function CategoriesPage({
  params,
}: {
  params: { storeId: string }
}) {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const formatedCategories: BillboardColumn[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    createdAt: format(category.createdAt, "MMMM dd, yyyy"),
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
