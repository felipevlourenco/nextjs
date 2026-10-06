"use server";

import { createChat } from "@/db";
import { getServerSession } from "next-auth";

export async function newChat(firstMessage: string) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  return createChat({
    userEmail: session.user.email,
    name: firstMessage.slice(0, 30),
    messages: [],
  });
}
