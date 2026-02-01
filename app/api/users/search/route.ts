import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json([], { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const users = await prisma.user.findMany({
    where: {
      name: {
        contains: q,
      },
      role: "user",
    },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return NextResponse.json(users);
}
