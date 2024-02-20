"use server";

// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment
import "server-only";
import prismadb from "@/lib/prismadb";

const setStoreData = async (storeId: string, userId: string, data: Partial<typeof prismadb.store.create>) => {
  const store = await prismadb.store.update({
    where: {
      id: storeId,
      userId: userId,
    },
    data: data,
  });

  return store;
};

const getStore = async (storeId: string, userId: string) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId: userId,
    },
  });

  return store;
};

const setStoreName = async (storeId: string, userId: string, name: string) => {
  const store = await setStoreData(storeId, userId, {
    name: name,
  });

  return store;
};

const storeActions = {
  getStore,
  setStoreName,
};

export default storeActions;
