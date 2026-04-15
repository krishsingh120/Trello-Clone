// Renders available members and toggles assignment on the active card.
import { useBoard } from '../../context/BoardContext';

export default function MemberAssign({ card }) {
  const { state, actions } = useBoard();
  const assignedMemberIds = (card.members || []).map((entry) => entry.member.id);

  return (
    <section className="detail-panel">
      <h3>Members</h3>
      <div className="picker-grid">
        {state.members.map((member) => {
          const isAssigned = assignedMemberIds.includes(member.id);
          return (
            <button
              key={member.id}
              type="button"
              className={`picker-chip ${isAssigned ? 'active' : ''}`}
              onClick={() =>
                isAssigned
                  ? actions.unassignMember(card.id, member.id)
                  : actions.assignMember(card.id, member.id)
              }
            >
              <span className="avatar-badge" style={{ backgroundColor: member.avatarColor }}>
                {member.name.slice(0, 1)}
              </span>
              {member.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}
