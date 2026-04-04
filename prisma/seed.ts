import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1. Criar usuário admin padrão
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@nocpedia.com" },
    update: {},
    create: {
      email: "admin@nocpedia.com",
      name: "Admin NOCPedia",
      password: adminPassword,
      role: Role.SUPER_ADMIN,
      active: true,
    },
  });

  console.log("Admin user created:", admin.email);

  // 2. Criar seções
  const redes = await prisma.section.upsert({
    where: { slug: "redes" },
    update: {},
    create: {
      name: "Redes",
      slug: "redes",
      description: "Equipamentos de rede, switches, roteadores e firewalls.",
      icon: "Globe",
      order: 1,
    },
  });

  const server = await prisma.section.upsert({
    where: { slug: "server" },
    update: {},
    create: {
      name: "Server",
      slug: "server",
      description: "Sistemas operacionais, serviços e virtualização.",
      icon: "Server",
      order: 2,
    },
  });

  // 3. Criar fabricantes
  const huawei = await prisma.manufacturer.upsert({
    where: { sectionId_slug: { sectionId: redes.id, slug: "huawei" } },
    update: {},
    create: {
      name: "Huawei",
      slug: "huawei",
      sectionId: redes.id,
      description: "Equipamentos Huawei (VRP Platform)",
      order: 1,
    },
  });

  const cisco = await prisma.manufacturer.upsert({
    where: { sectionId_slug: { sectionId: redes.id, slug: "cisco" } },
    update: {},
    create: {
      name: "Cisco",
      slug: "cisco",
      sectionId: redes.id,
      description: "Equipamentos Cisco (IOS, IOS-XE)",
      order: 2,
    },
  });

  const linux = await prisma.manufacturer.upsert({
    where: { sectionId_slug: { sectionId: server.id, slug: "linux" } },
    update: {},
    create: {
      name: "Linux",
      slug: "linux",
      sectionId: server.id,
      description: "Distribuições Linux (Debian, Ubuntu, CentOS)",
      order: 1,
    },
  });

  // 4. Criar categorias
  const bgp = await prisma.category.upsert({
    where: { manufacturerId_slug: { manufacturerId: huawei.id, slug: "bgp" } },
    update: {},
    create: {
      name: "Router BGP",
      slug: "bgp",
      manufacturerId: huawei.id,
      description: "Comandos para configuração e troubleshooting de BGP",
      order: 1,
    },
  });

  const bng = await prisma.category.upsert({
    where: { manufacturerId_slug: { manufacturerId: huawei.id, slug: "bng" } },
    update: {},
    create: {
      name: "BNG / PPPoE",
      slug: "bng",
      manufacturerId: huawei.id,
      description: "Comandos para gerenciamento de usuários PPPoE",
      order: 2,
    },
  });

  // 5. Criar comandos exemplo
  await prisma.command.createMany({
    data: [
      {
        categoryId: bgp.id,
        title: "Ver resumo das sessões BGP",
        description: "Exibe o status de todos os peers BGP configurados",
        code: "display bgp peer",
        platform: "VRP",
        tags: ["bgp", "peer", "status"],
        order: 1,
      },
      {
        categoryId: bgp.id,
        title: "Ver rotas recebidas de um peer",
        description: "Exibe as rotas que estão sendo recebidas de um vizinho específico",
        code: "display bgp routing-table peer 10.0.0.1 received-routes",
        platform: "VRP",
        tags: ["bgp", "routes", "received"],
        order: 2,
      },
      {
        categoryId: bng.id,
        title: "Ver usuários PPPoE online",
        description: "Lista todos os usuários PPPoE conectados no momento",
        code: "display access-user",
        platform: "VRP",
        tags: ["pppoe", "users", "online"],
        order: 1,
      },
    ],
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
