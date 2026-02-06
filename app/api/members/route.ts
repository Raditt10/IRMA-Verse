import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";


export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const User = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
        
    if (!User) {
      console.log('User not found in database:', session.user.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const users = await prisma.user.findMany({
      where: {
        NOT: {
          OR: [
            { role: "instruktur" },
            { role: "admin" },
          ],
        },
      },
      select: {
        id: true,
        name: true,
        role: true,
        avatar: true,
        status: true,
        points: true,
        class: true,
        // Add other fields you want to expose
        // You can add more fields as needed
        // e.g. class, points, status if available in your schema
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}
