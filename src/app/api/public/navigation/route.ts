import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sections = await prisma.section.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: {
        manufacturers: {
          where: { active: true },
          orderBy: { order: "asc" },
          include: {
            categories: {
              where: { active: true },
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });
    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
