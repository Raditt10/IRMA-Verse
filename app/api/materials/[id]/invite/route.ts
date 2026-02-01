import prisma from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"
import crypto from "crypto"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    const { userIds, invitedById } = await req.json()
    const materialId = params.id

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user exists
    const User = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
        
    if (!User) {
      console.log('User not found in database:', session.user.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log('User found:', User.email, User.role);

    if (User.role !== 'instruktur') {
      return NextResponse.json({ error: "Only instructors are allowed to invite users!" }, { status: 403 });
    }

    await prisma.materialInvite.createMany({
      data: userIds.map((userId: string) => ({
        materialId,
        invitedUserId: userId,
        invitedById,
        token: crypto.randomUUID(),
        expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      })),
      skipDuplicates: true
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error inviting users to material:", error)
    return NextResponse.json(
      { error: "Failed to invite users to material" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user exists
    const User = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
        
    if (!User) {
      console.log('User not found in database:', session.user.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log('User found:', User.email, User.role);

    if (User.role !== 'instruktur' && User.role !== 'admin') {
      return NextResponse.json({ error: "Only instructors and admins are allowed to access this page!" }, { status: 403 });
    }
    const query = req.nextUrl.searchParams.get("q") || ""
    const materialId = params.id

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { email: { contains: query } }
        ],
        NOT: {
          courseEnrollments: { some: { materialId } }
        }
      },
      take: 10
    })

    return NextResponse.json(users)
  }
  catch (error) {
    console.error("Error searching users for invitation:", error)
    return NextResponse.json(
      { error: "Failed to search users for invitation" },
      { status: 500 }
    )
  }
}