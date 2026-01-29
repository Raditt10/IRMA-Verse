import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/users/profile
 * Fetch current logged-in user's profile data
 */
export async function GET(request: NextRequest) {
  try {
    // Get session from auth
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        notelp: true,
        address: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user,
      message: "Data pengguna berhasil diambil",
    });
  } catch (error) {
    console.error("Error in GET /api/users/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users/profile
 * Update current logged-in user's profile
 * Body: { name?, notelp?, address?, bio? }
 */
export async function PATCH(request: NextRequest) {
  try {
    // Get session from auth
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, notelp, address, bio } = body;

    // Validate input (optional - can add more validation)
    if (
      typeof name !== "undefined" && typeof name !== "string"
    ) {
      return NextResponse.json(
        { error: "Name harus berupa string" },
        { status: 400 }
      );
    }

    if (
      typeof notelp !== "undefined" && typeof notelp !== "string"
    ) {
      return NextResponse.json(
        { error: "Nomor telepon harus berupa string" },
        { status: 400 }
      );
    }

    if (
      typeof address !== "undefined" && typeof address !== "string"
    ) {
      return NextResponse.json(
        { error: "Alamat harus berupa string" },
        { status: 400 }
      );
    }

    if (
      typeof bio !== "undefined" && typeof bio !== "string"
    ) {
      return NextResponse.json(
        { error: "Bio harus berupa string" },
        { status: 400 }
      );
    }

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(typeof name !== "undefined" && { name }),
        ...(typeof notelp !== "undefined" && { notelp }),
        ...(typeof address !== "undefined" && { address }),
        ...(typeof bio !== "undefined" && { bio }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        notelp: true,
        address: true,
        bio: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      user: updatedUser,
      message: "Data pengguna berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error in PATCH /api/users/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
