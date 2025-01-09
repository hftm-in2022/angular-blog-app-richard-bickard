export function hasRole(accessToken: string, role: string): boolean {
  const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
  const roles: string[] = decodedToken?.realm_access?.roles || [];
  return roles.includes(role);
}
