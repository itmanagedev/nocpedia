import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const sectionId = searchParams.get("sectionId");

  try {
    const manufacturers = await prisma.manufacturer.findMany({
      where: sectionId ? { sectionId } : {},
      include: { section: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(manufacturers);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const manufacturer = await prisma.manufacturer.create({
      data: body,
    });
    return NextResponse.json(manufacturer);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
