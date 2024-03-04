import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(
  request: Request,
  { params }: { params: { storeId: string } }
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

    const storeByUserId = await prismadb.store.findUnique({
      where: {
        id: params.storeId,
        userId: userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const colors = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    })

    return NextResponse.json(colors)
  } catch (error) {
    console.log("[COLORS_POST]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 })
    }

    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    })

    return NextResponse.json(colors)
  } catch (error) {
    console.log("[COLORS_GET]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
