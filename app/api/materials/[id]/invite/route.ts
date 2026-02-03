import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getIO } from "@/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const { userIds } = await req.json();
    const { id: materialId } = await params;

    console.log("=== INVITE REQUEST ===");
    console.log("Received userIds:", userIds);
    console.log("Material ID:", materialId);
    console.log("Instructor (session.user.id):", session?.user?.id);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 },
      );
    }

    // Check if user exists
    const User = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!User) {
      console.log("User not found in database:", session.user.id);
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }
    console.log("User found:", User.email, User.role);

    if (User.role !== "instruktur" && User.role !== "admin") {
      return NextResponse.json(
        { error: "Hanya instruktur yang bisa mengundang peserta!" },
        { status: 403 },
      );
    }

    // Check which users already have pending or accepted invitations
    const existingInvites = await prisma.materialInvite.findMany({
      where: {
        materialId,
        userId: { in: userIds },
        status: { in: ["pending", "accepted"] },
      },
      select: { userId: true },
    });

    const alreadyInvitedIds = existingInvites.map((invite) => invite.userId);
    const newUserIds = userIds.filter(
      (id: string) => !alreadyInvitedIds.includes(id),
    );

    // Create invitations for new users
    if (newUserIds.length > 0) {
      // Generate a simple token for each invitation
      const generateToken = () =>
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      console.log("Creating invitations for users:", newUserIds);

      // Get material details for socket notification
      const material = await prisma.material.findUnique({
        where: { id: materialId },
        select: {
          id: true,
          title: true,
          date: true,
          category: true,
          grade: true,
        },
      });

      // Create invitations
      const invitations = await Promise.all(
        newUserIds.map(async (userId: string) => {
          const token = generateToken();
          const invitation = await prisma.materialInvite.create({
            data: {
              materialId,
              instructorId: session.user.id,
              userId,
              token,
              status: "pending",
            },
            include: {
              material: true,
              instructor: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          });

          // Emit socket event to user
          try {
            const io = getIO();
            if (io) {
              io.to(`user:${userId}`).emit("invitation:new", {
                id: invitation.id,
                token: invitation.token,
                materialId: material?.id,
                materialTitle: material?.title,
                instructorName: User.name,
                instructorId: User.id,
                createdAt: invitation.createdAt,
                invitation: invitation,
              });
              console.log(`Socket notification sent to user:${userId}`);
            }
          } catch (socketError) {
            console.error("Socket emit error:", socketError);
            // Continue even if socket fails
          }

          return invitation;
        }),
      );

      console.log("Invitations created successfully:", invitations.length);
    }

    return NextResponse.json({
      success: true,
      newInvites: newUserIds.length,
      newUserIds: newUserIds,
      alreadyInvited: alreadyInvitedIds,
      totalAttempted: userIds.length,
      materialId: materialId,
      instructorId: session.user.id,
    });
  } catch (error) {
    console.error("Error inviting users to material:", error);
    return NextResponse.json(
      { error: "Gagal mengundang peserta" },
      { status: 500 },
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 },
      );
    }

    // Check if user exists
    const User = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!User) {
      console.log("User not found in database:", session.user.id);
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }
    console.log("User found:", User.email, User.role);

    if (User.role !== "instruktur" && User.role !== "admin") {
      return NextResponse.json(
        {
          error: "Hanya instruktur dan admin yang bisa mengakses halaman ini!",
        },
        { status: 403 },
      );
    }
    const query = req.nextUrl.searchParams.get("q") || "";
    const { id: materialId } = await params;

    const users = await prisma.user.findMany({
      where: {
        OR: [{ name: { contains: query } }, { email: { contains: query } }],
        NOT: {
          courseEnrollments: { some: { materialId } },
        },
      },
      take: 10,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error searching users for invitation:", error);
    return NextResponse.json(
      { error: "Gagal mencari pengguna untuk undangan" },
      { status: 500 },
    );
  }
}
