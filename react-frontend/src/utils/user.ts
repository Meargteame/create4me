import type { User } from '../types';

/**
 * Get the display name for a user
 * Priority: name > email username > 'User'
 */
export function getUserDisplayName(user: User | null | undefined): string {
  if (!user) return 'User';
  if (user.name && user.name.trim()) return user.name;
  if (user.email) return user.email.split('@')[0];
  return 'User';
}

/**
 * Get initials from user for avatar
 */
export function getUserInitials(user: User | null | undefined): string {
  if (!user) return '?';
  
  if (user.name && user.name.trim()) {
    const nameParts = user.name.trim().split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return user.name[0].toUpperCase();
  }
  
  if (user.email) {
    return user.email[0].toUpperCase();
  }
  
  return '?';
}
