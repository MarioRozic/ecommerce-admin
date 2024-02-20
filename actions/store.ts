"use server";

// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment
import "server-only";
import prismadb from "@/lib/prismadb";
import type { Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs";

const setStoreData = async (storeId: string, userId: string, data: Prisma.StoreUpdateInput) => {
  const store = await prismadb.store.update({
    where: {
      id: storeId,
      userId: userId,
    },
    data: data,
  });

  return store;
};

export const getStore = async (data: { id?: string; userId: string }) => {
  const store = await prismadb.store.findFirst({
    where: data,
  });

  return store;
};

export const setStoreName = async (storeId: string, userId: string, name: string) => {
  const store = await setStoreData(storeId, userId, {
    name: name,
  });

  return store;
};

export const createStore = async (values: { name: string }) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const store = await prismadb.store.create({
    data: {
      ...values,
      userId,
    },
  });

  return store;
};
