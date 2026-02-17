import prisma from "@/lib/prisma";
import { CourseCategory, Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import { createBulkNotifications } from "@/lib/notifications";
import { emitNotificationsToUsers } from "@/lib/socket-emit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user exists
    const User = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!User) {
      console.log("User not found in database:", session.user.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure we have an id before calling Prisma
    if (!id) {
      return NextResponse.json(
        { error: "Missing material id" },
        { status: 400 },
      );
    }

    // Fetch single material by id with related data
    const m = await prisma.material.findUnique({
      where: { id: id },
      include: {
        instructor: { select: { name: true, email: true } },
        enrollments: { where: { userId: User.id }, select: { id: true } },
        invites: {
          include: {
            user: { select: { email: true, name: true, avatar: true } },
          },
        },
      },
    });

    if (!m) {
      return NextResponse.json(
        { error: "Kajian tidak ditemukan" },
        { status: 404 },
      );
    }

    const CATEGORY_LABEL: Record<CourseCategory, string> = {
      Wajib: "Program Wajib",
      Extra: "Program Ekstra",
      NextLevel: "Program Next Level",
      Susulan: "Program Susulan",
    };

    const GRADE_LABEL = {
      X: "Kelas 10",
      XI: "Kelas 11",
      XII: "Kelas 12",
    } as const;

    const isPrivileged = User.role === "instruktur" || User.role === "admin";

    const result = {
      id: m.id,
      title: m.title,
      description: m.description,
      date: m.date,
      instructor: m.instructor?.name || null,
      insttructorEmail: m.instructor?.email || null,
      category: CATEGORY_LABEL[m.category as keyof typeof CATEGORY_LABEL],
      grade: GRADE_LABEL[m.grade as keyof typeof GRADE_LABEL],
      startedAt: m.startedAt,
      thumbnailUrl: m.thumbnailUrl,
      isJoined: m.enrollments.length > 0,
      // For editing: flat email list of all invited users
      invites: (m.invites || [])
        .map((inv) => inv.user?.email || null)
        .filter(Boolean),
      // For instructor view: rich invite status data
      inviteDetails: isPrivileged
        ? (m.invites || []).map((inv) => ({
            id: inv.id,
            email: inv.user?.email || null,
            name: inv.user?.name || null,
            avatar: inv.user?.avatar || null,
            status: inv.status,
            createdAt: inv.createdAt,
          }))
        : undefined,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching material by id:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch material",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
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

    // Check if user is instructor or admin
    if (session.user.role !== "instruktur" && session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Hanya instruktur atau admin yang bisa menghapus kajian" },
        { status: 403 },
      );
    }

    const { id } = await params;

    // Check if material exists and user is the owner
    const material = await prisma.material.findUnique({
      where: { id },
      select: { instructorId: true },
    });

    if (!material) {
      return NextResponse.json(
        { error: "Kajian tidak ditemukan" },
        { status: 404 },
      );
    }

    // Check authorization (only instructor/admin who created it or admin can delete)
    if (
      material.instructorId !== session.user.id &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Anda tidak memiliki izin menghapus kajian ini" },
        { status: 403 },
      );
    }

    // Delete material (cascading delete will handle enrollments)
    await prisma.material.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Kajian berhasil dihapus" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting material:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Gagal menghapus kajian",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
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

    // Check if user is instructor or admin
    if (session.user.role !== "instruktur" && session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Hanya instruktur atau admin yang bisa mengedit kajian" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await req.json();
    const {
      title,
      description,
      date,
      time,
      category,
      grade,
      thumbnailUrl,
      invites,
    } = body;

    // Detailed validation
    if (!title || !title.toString().trim()) {
      return NextResponse.json(
        { error: "Judul kajian harus diisi" },
        { status: 400 },
      );
    }
    if (title.toString().trim().length < 3) {
      return NextResponse.json(
        { error: "Judul kajian minimal 3 karakter" },
        { status: 400 },
      );
    }
    if (!description || !description.toString().trim()) {
      return NextResponse.json(
        { error: "Deskripsi kajian harus diisi" },
        { status: 400 },
      );
    }
    if (description.toString().trim().length < 10) {
      return NextResponse.json(
        { error: "Deskripsi kajian minimal 10 karakter" },
        { status: 400 },
      );
    }
    if (!date) {
      return NextResponse.json(
        { error: "Tanggal kajian harus dipilih" },
        { status: 400 },
      );
    }
    if (!time) {
      return NextResponse.json(
        { error: "Jam kajian harus dipilih" },
        { status: 400 },
      );
    }

    // Check if material exists and user is the owner
    const material = await prisma.material.findUnique({
      where: { id },
      select: { instructorId: true },
    });

    if (!material) {
      return NextResponse.json(
        { error: "Kajian tidak ditemukan" },
        { status: 404 },
      );
    }

    // Check authorization
    if (
      material.instructorId !== session.user.id &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Anda tidak memiliki izin mengedit kajian ini" },
        { status: 403 },
      );
    }

    // Map category and grade
    const CATEGORY_MAP: Record<string, string> = {
      "Program Wajib": "Wajib",
      "Program Ekstra": "Extra",
      "Program Next Level": "NextLevel",
      "Program Susulan": "Susulan",
    };

    const GRADE_MAP: Record<string, string> = {
      Semua: "X",
      "Kelas 10": "X",
      "Kelas 11": "XI",
      "Kelas 12": "XII",
    };

    const mappedCategory = CATEGORY_MAP[category] || "Wajib";
    const mappedGrade = GRADE_MAP[grade] || "X";

    // Update material
    const updatedMaterial = await prisma.material.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date),
        startedAt: time || null,
        category: mappedCategory as any,
        grade: mappedGrade as any,
        thumbnailUrl: thumbnailUrl || null,
      },
      include: {
        instructor: {
          select: { name: true },
        },
      },
    });

    // Handle new invites if provided
    if (invites && Array.isArray(invites) && invites.length > 0) {
      // Look up user IDs by email
      const invitedUsersDb = await prisma.user.findMany({
        where: { email: { in: invites } },
        select: { id: true, email: true },
      });

      const invitedUserIds = invitedUsersDb.map((u) => u.id);

      // Check which users already have pending or accepted invitations
      const existingInvites = await prisma.materialInvite.findMany({
        where: {
          materialId: id,
          userId: { in: invitedUserIds },
          status: { in: ["pending", "accepted"] },
        },
        select: { userId: true },
      });

      const alreadyInvitedIds = new Set(
        existingInvites.map((inv) => inv.userId),
      );
      const newUsers = invitedUsersDb.filter(
        (u) => !alreadyInvitedIds.has(u.id),
      );

      if (newUsers.length > 0) {
        const generateToken = () =>
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);

        const inviteData = newUsers.map((u) => ({
          materialId: id,
          instructorId: session.user.id,
          userId: u.id,
          token: generateToken(),
          status: "pending" as const,
        }));

        await prisma.materialInvite.createMany({ data: inviteData });

        // Create notification records for newly invited users
        const notifications = await createBulkNotifications(
          inviteData.map((inv) => ({
            userId: inv.userId,
            type: "invitation" as const,
            title: "Undangan Kajian",
            message: `${updatedMaterial.instructor?.name || "Instruktur"} mengundang Anda untuk bergabung ke kajian "${updatedMaterial.title}"`,
            icon: "book",
            resourceType: "material",
            resourceId: id,
            actionUrl: `/materials/${id}`,
            inviteToken: inv.token,
            senderId: session.user.id,
          })),
        );

        // Push real-time notifications
        await emitNotificationsToUsers(
          notifications.map((n) => ({ userId: n.userId, notification: n })),
        );
      }
    }

    return NextResponse.json(updatedMaterial, { status: 200 });
  } catch (error) {
    console.error("Error updating material:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Gagal mengedit kajian",
      },
      { status: 500 },
    );
  }
}
