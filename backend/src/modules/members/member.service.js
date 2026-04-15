// Handles member listing business logic.
const memberRepo = require('./member.repo');

async function getMembers() {
  return memberRepo.findAllMembers();
}

module.exports = {
  getMembers,
};
