import { NextRequest, NextResponse } from 'next/server';
import prisma  from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Gunakan CONCAT dan LOWER untuk case-insensitive search yang reliable
    const newsResults: any[] = await prisma.$queryRaw`
      SELECT id, title, slug, deskripsi, image, category
      FROM news
      WHERE 
        CONCAT(LOWER(title), ' ', LOWER(deskripsi), ' ', LOWER(COALESCE(content, ''))) 
        LIKE CONCAT('%', LOWER(${query}), '%')
      ORDER BY createdAt DESC
      LIMIT 8
    `;

    // Search untuk Pengguna (Users)
    const userResults: any[] = await prisma.$queryRaw`
      SELECT id, name, email, role, bio
      FROM users
      WHERE 
        CONCAT(LOWER(COALESCE(name, '')), ' ', LOWER(COALESCE(email, '')), ' ', LOWER(COALESCE(bio, '')))
        LIKE CONCAT('%', LOWER(${query}), '%')
        AND role != 'instruktur'
      LIMIT 5
    `;

    // Instruktur (filtered from Users)
    const instructorResults: any[] = await prisma.$queryRaw`
      SELECT id, name, bidangKeahlian, pengalaman, role
      FROM users
      WHERE 
        role = 'instruktur' AND
        CONCAT(LOWER(COALESCE(name, '')), ' ', LOWER(COALESCE(bidangKeahlian, '')), ' ', LOWER(COALESCE(pengalaman, '')))
        LIKE CONCAT('%', LOWER(${query}), '%')
      LIMIT 5
    `;

    const results = [
      ...newsResults.map((news: any) => ({
        id: news.id,
        type: 'news',
        title: news.title,
        slug: news.slug,
        description: news.deskripsi,
        image: news.image,
        category: news.category,
      })),
      ...userResults.map((user: any) => ({
        id: user.id,
        type: 'user',
        title: user.name || user.email,
        email: user.email,
        role: user.role,
        bio: user.bio,
      })),
      ...instructorResults.map((instructor: any) => ({
        id: instructor.id,
        type: 'instructor',
        title: instructor.name,
        bidangKeahlian: instructor.bidangKeahlian,
        pengalaman: instructor.pengalaman,
      })),
    ];

    return NextResponse.json({ results, query });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
