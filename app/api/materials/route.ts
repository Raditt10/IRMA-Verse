import prisma from "@/lib/prisma";
import { CourseCategory, Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const searchParams = req.nextUrl.searchParams;

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

    const where: Prisma.MaterialWhereInput = {};
    const category = searchParams.get("category");
    if (category && Object.values(CourseCategory).includes(category as CourseCategory)) {
      where.category = category as CourseCategory;
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

    const materials = await prisma.material.findMany({
      where,
      include: {
        instructor: {
          select: { 
            name: true
          },
        },
        enrollments: {
          where: { userId: User.id },
          select: { id: true },
        },
      },
      orderBy: { date: "desc" },
    });

    // normalize ke format frontend
    const result = materials.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      date: m.date,
      instructor: m.instructor.name,
      category: CATEGORY_LABEL[m.category as keyof typeof CATEGORY_LABEL],
      grade: GRADE_LABEL[m.grade as keyof typeof GRADE_LABEL],
      startedAt: m.startedAt,
      thumbnailUrl: m.thumbnailUrl,
      isJoined: m.enrollments.length > 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching materials:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch materials" },
      { status: 500 }
    );
  }
}