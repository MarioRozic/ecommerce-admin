import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Categpry ID is required", { status: 400 })
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log("[CATEGORY_GET]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth()
    const body = await request.json()
    const { name, billboardId } = body

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!name) {
      return new NextResponse("name is required", { status: 400 })
    }

    if (!billboardId) {
      return new NextResponse("billboardId is required", { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 })
    }

    if (!params.categoryId) {
      return new NextResponse("Category ID is required", { status: 400 })
    }

    const storeByUserId = await prismadb.store.findUnique({
      where: {
        id: params.storeId,
        userId: userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 })
    }

    if (!params.categoryId) {
      return new NextResponse("Category ID is required", { status: 400 })
    }

    const storeByUserId = await prismadb.store.findUnique({
      where: {
        id: params.storeId,
        userId: userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
