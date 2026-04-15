// Handles HTTP requests for member listing.
const memberService = require('./member.service');

async function getMembers(req, res, next) {
  try {
    const members = await memberService.getMembers();
    res.json({ data: members });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMembers,
};
