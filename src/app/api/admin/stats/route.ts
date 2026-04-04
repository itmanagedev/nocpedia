import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [commands, manufacturers, categories, users, thisMonthCommands] = await Promise.all([
      prisma.command.count(),
      prisma.manufacturer.count(),
      prisma.category.count(),
      prisma.user.count(),
      prisma.command.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    return NextResponse.json({
      commands,
      manufacturers,
      categories,
      users,
      thisMonthCommands,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
