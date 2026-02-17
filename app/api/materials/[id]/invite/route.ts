import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { createBulkNotifications } from "@/lib/notifications";
import { emitNotificationsToUsers } from "@/lib/socket-emit";

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

      // Generate tokens for each user
      const inviteData = newUserIds.map((userId: string) => ({
        materialId,
        instructorId: session.user.id,
        userId,
        token: generateToken(),
        status: "pending" as const,
      }));

      await prisma.materialInvite.createMany({
        data: inviteData,
      });

      // Fetch the material title for notification message
      const material = await prisma.material.findUnique({
        where: { id: materialId },
        select: { title: true },
      });

      // Create notification records for each invited user
      const notifications = await createBulkNotifications(
        inviteData.map((inv: { userId: string; token: string }) => ({
          userId: inv.userId,
          type: "invitation" as const,
          title: material?.title || "Undangan Kajian",
          message: `${User.name || "Instruktur"} mengundang Anda untuk bergabung ke kajian "${material?.title || "Materi"}"`,
          icon: "book",
          resourceType: "material",
          resourceId: materialId,
          actionUrl: `/materials/${materialId}`,
          inviteToken: inv.token,
          senderId: session.user.id,
        })),
      );

      // Push notifications via WebSocket in real-time
      await emitNotificationsToUsers(
        notifications.map((n) => ({
          userId: n.userId,
          notification: n,
        })),
      );

      console.log("Invitations + notifications created successfully");
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
