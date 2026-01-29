import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET all schedules
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const schedules = await prisma.schedule.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 }
    );
  }
}

// POST create new schedule (instructor only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Debug session
    console.log('Session:', JSON.stringify(session, null, 2));
    console.log('User ID:', session.user.id);
    
    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
    
    if (!userExists) {
      console.log('User not found in database:', session.user.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    console.log('User found:', userExists.email, userExists.role);

    // Check if user is instructor
    if (session.user.role !== "instruktur") {
      return NextResponse.json(
        { error: "Only instructors can create schedules" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      fullDescription,
      date,
      time,
      location,
      pemateri,
      thumbnailUrl,
    } = body;

    // Validation
    if (!title || !description || !date || !time || !location || !pemateri) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const schedule = await prisma.schedule.create({
      data: {
        title,
        description,
        fullDescription,
        date: new Date(date),
        time,
        location,
        pemateri,
        thumbnailUrl,
        instructorId: session.user.id,
        status: "segera_hadir",
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create schedule" },
      { status: 500 }
    );
  }
}
