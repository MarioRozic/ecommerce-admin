import prismadb from "@/lib/prismadb"
import Client from "./components/client"
import { CategoryColumn } from "./components/columns"

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
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const formatedCategories: CategoryColumn[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, "MMMM dd, yyyy"),
  }))

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Client data={formatedCategories} />
        </div>
      </div>
    </>
  )
}
