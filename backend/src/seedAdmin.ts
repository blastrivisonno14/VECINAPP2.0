import prisma from './lib/prisma'

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com'
  const passwordHash = '$2b$10$abcdefghijklmnopqrstuv' // Placeholder hash; replace by creating via bcrypt
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log('Admin ya existe:', existing.email)
    return
  }
  // Quick seed: create admin with dummy hash; you MUST update password manually
  const admin = await prisma.user.create({ data: { email, passwordHash, role: 'ADMIN' as any, name: 'Admin' } })
  console.log('Admin creado:', admin)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(()=>prisma.$disconnect())
