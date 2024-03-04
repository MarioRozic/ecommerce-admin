import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Size ID is required", { status: 400 })
    }

    const sizes = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    })

    return NextResponse.json(sizes)
  } catch (error) {
    console.log("[SIZES_GET]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth()
    const body = await request.json()
    const { name, value } = body

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!name) {
      return new NextResponse("name is required", { status: 400 })
    }

    if (!value) {
      return new NextResponse("value is required", { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 })
    }

    if (!params.sizeId) {
      return new NextResponse("Size ID is required", { status: 400 })
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

    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log("[SIZE_PATCH]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 })
    }

    if (!params.sizeId) {
      return new NextResponse("Size ID is required", { status: 400 })
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

    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log("[SIZE_DELETE]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
