export type TeamRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export type TeamAction = 'view_scans' | 'create_scan' | 'manage_project' | 'manage_members';

const ROLE_PERMISSIONS: Record<TeamRole, TeamAction[]> = {
  OWNER: ['view_scans', 'create_scan', 'manage_project', 'manage_members'],
  ADMIN: ['view_scans', 'create_scan', 'manage_project', 'manage_members'],
  MEMBER: ['view_scans', 'create_scan'],
  VIEWER: ['view_scans'],
};

export function canPerformAction(role: TeamRole, action: TeamAction): boolean {
  return ROLE_PERMISSIONS[role]?.includes(action) ?? false;
}

export function isValidTeamRole(value: string): value is TeamRole {
  return value === 'OWNER' || value === 'ADMIN' || value === 'MEMBER' || value === 'VIEWER';
}
