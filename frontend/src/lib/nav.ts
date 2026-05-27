export type NavSection =
  | 'home'
  | 'my-groups'
  | 'assignments'
  | 'ai-toolkit'
  | 'library'
  | 'settings'

type SectionMeta = {
  label: string
  topbarLabel: string
  icon: string
  mobileIcon?: string
  href: string
}

export const SECTIONS: Record<NavSection, SectionMeta> = {
  home: {
    label: 'Home',
    topbarLabel: 'Home',
    icon: '/icons/home.svg',
    mobileIcon: '/icons/home-mobile.svg',
    href: '/home',
  },
  'my-groups': {
    label: 'My Groups',
    topbarLabel: 'My Groups',
    icon: '/icons/my-groups.svg',
    href: '/my-groups',
  },
  assignments: {
    label: 'Assignments',
    topbarLabel: 'Assignment',
    icon: '/icons/assignments.svg',
    mobileIcon: '/icons/assignments-mobile.svg',
    href: '/assignments',
  },
  'ai-toolkit': {
    label: "AI Teacher's Toolkit",
    topbarLabel: "AI Teacher's Toolkit",
    icon: '/icons/ai-toolkit.svg',
    href: '/ai-toolkit',
  },
  library: {
    label: 'My Library',
    topbarLabel: 'My Library',
    icon: '/icons/my-library.svg',
    mobileIcon: '/icons/library-mobile.svg',
    href: '/library',
  },
  settings: {
    label: 'Settings',
    topbarLabel: 'Settings',
    icon: '/icons/settings.svg',
    href: '/settings',
  },
}

export function sectionForPath(pathname: string): NavSection | null {
  if (pathname === '/' || pathname.startsWith('/assignments')) {
    return 'assignments'
  }
  if (pathname.startsWith('/home')) return 'home'
  if (pathname.startsWith('/my-groups')) return 'my-groups'
  if (pathname.startsWith('/ai-toolkit')) return 'ai-toolkit'
  if (pathname.startsWith('/library')) return 'library'
  if (pathname.startsWith('/settings')) return 'settings'
  return null
}
