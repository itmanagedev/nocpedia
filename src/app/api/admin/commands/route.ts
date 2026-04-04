import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");
  const search = searchParams.get("search") || "";

  try {
    const where = search ? {
      OR: [
        { title: { contains: search, mode: "insensitive" as any } },
        { tags: { hasSome: [search] } },
        { description: { contains: search, mode: "insensitive" as any } },
      ]
    } : {};

    const [commands, totalCount] = await Promise.all([
      prisma.command.findMany({
        where,
        include: { category: { include: { manufacturer: { include: { section: true } } } } },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.command.count({ where }),
    ]);

    return NextResponse.json({ commands, totalCount });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const command = await prisma.command.create({
      data: body,
    });
    return NextResponse.json(command);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
