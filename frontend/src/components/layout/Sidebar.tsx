/* eslint-disable @next/next/no-img-element */

import CreateAssignmentButton from './CreateAssignmentButton'
import NavItem from './NavItem'
import SchoolCard from './SchoolCard'
import { SECTIONS } from '@/lib/nav'

export default function Sidebar() {
  return (
    <aside className="w-[260px] h-screen bg-surface rounded-r-[28px] flex flex-col shrink-0">
      <div className="px-5 pt-6 pb-4 flex items-center gap-2">
        <img src="/icons/logo.png" alt="" width={28} height={28} />
        <span className="text-lg font-semibold text-neutral-900">VedaAI</span>
      </div>

      <div className="px-4 pb-4">
        <CreateAssignmentButton />
      </div>

      <nav className="px-3 flex-1 space-y-1 overflow-y-auto">
        <NavItem href={SECTIONS.home.href} icon={SECTIONS.home.icon}>
          {SECTIONS.home.label}
        </NavItem>
        <NavItem href={SECTIONS['my-groups'].href} icon={SECTIONS['my-groups'].icon}>
          {SECTIONS['my-groups'].label}
        </NavItem>
        <NavItem
          href={SECTIONS.assignments.href}
          icon={SECTIONS.assignments.icon}
        >
          {SECTIONS.assignments.label}
        </NavItem>
        <NavItem
          href={SECTIONS['ai-toolkit'].href}
          icon={SECTIONS['ai-toolkit'].icon}
        >
          {SECTIONS['ai-toolkit'].label}
        </NavItem>
        <NavItem href={SECTIONS.library.href} icon={SECTIONS.library.icon}>
          {SECTIONS.library.label}
        </NavItem>
      </nav>

      <div className="px-3 pt-3 pb-2">
        <NavItem href={SECTIONS.settings.href} icon={SECTIONS.settings.icon}>
          {SECTIONS.settings.label}
        </NavItem>
      </div>

      <SchoolCard />
    </aside>
  )
}
