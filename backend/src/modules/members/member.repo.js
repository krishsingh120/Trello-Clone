// Runs Prisma queries for member listing.
const prisma = require('../../config/db');

async function findAllMembers() {
  return prisma.member.findMany({
    orderBy: { id: 'asc' },
  });
}

module.exports = {
  findAllMembers,
};
