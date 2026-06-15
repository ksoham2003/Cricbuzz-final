import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';

export function formatMatchDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isToday(date)) return `Today, ${format(date, 'h:mm a')}`;
  if (isTomorrow(date)) return `Tomorrow, ${format(date, 'h:mm a')}`;
  return format(date, 'MMM d, yyyy · h:mm a');
}

export function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isPast(date)) return 'Started';
  return `Starts ${formatDistanceToNow(date, { addSuffix: true })}`;
}

export function getStatusLabel(status) {
  const map = {
    LIVE: 'Live',
    UPCOMING: 'Upcoming',
    COMPLETED: 'Completed',
    TOSS_COMPLETED: 'Toss Done',
    PLAYING_XI_SELECTED: 'XI Selected',
    INNINGS_BREAK: 'Innings Break',
    DRAFT: 'Draft',
  };
  return map[status] || status;
}

export function getStatusClass(status) {
  if (status === 'LIVE' || status === 'INNINGS_BREAK') return 'live';
  if (status === 'UPCOMING' || status === 'TOSS_COMPLETED' || status === 'PLAYING_XI_SELECTED') return 'upcoming';
  if (status === 'COMPLETED') return 'completed';
  return 'upcoming';
}

export function formatScore(score) {
  if (!score) return '';
  const w = score.wickets !== undefined ? `/${score.wickets}` : '';
  return `${score.score || 0}${w}`;
}

export function formatOvers(overs) {
  if (!overs) return '';
  return `(${overs} ov)`;
}

export function getTeamShort(team) {
  return team?.shortName || team?.name?.substring(0, 3).toUpperCase() || '???';
}

export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
}

export function getRoleBadgeColor(role) {
  const colors = {
    BATSMAN: '#3B82F6',
    BOWLER: '#22C55E',
    ALL_ROUNDER: '#A855F7',
    WICKET_KEEPER: '#F59E0B',
  };
  return colors[role] || '#94A3B8';
}

export function getRoleLabel(role) {
  const map = {
    BATSMAN: 'Batsman',
    BOWLER: 'Bowler',
    ALL_ROUNDER: 'All-Rounder',
    WICKET_KEEPER: 'Wicket-Keeper',
  };
  return map[role] || role;
}
