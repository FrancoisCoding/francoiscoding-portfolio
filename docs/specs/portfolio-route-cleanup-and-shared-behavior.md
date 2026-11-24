# Portfolio Route Cleanup and Shared Behavior

## Problem Statement

The sitemap advertises an Experience page and a FinanceFlow detail page that the portfolio never
links to. Career history is already available under Expertise on About, and the homepage project
cards already take visitors to the live products or repositories.

The remaining pages also have three rules that are hard to change consistently. The booking
calendar decides which days are clickable separately from how submission rechecks availability,
so a visitor can choose a day and still see the previous day's times. The Tool Stack keeps core
membership and usage descriptions in separate lists, and the core array's order does not determine
display order. Finally, the first-render script and React each interpret the motion preference,
so a change to one can disagree with the other.

## Solution

Retire the standalone Experience page and all first-party project detail routes. Leave the
portfolio's current navigation intact. Give the booking module ownership of slot and calendar-date
rules, keep each tool's placement with its description, and make the browser's first render and
React use the same motion policy. Keep the current visual design, links, and workflows except
where this spec describes a behavior change.

## User Stories

1. As a recruiter, I want to find career history under About's Expertise section, so that I can
   read it through the existing navigation.
2. As a recruiter, I want company links and the résumé to keep working, so that I can learn more
   without needing a standalone Experience page.
3. As a portfolio visitor, I want the homepage project cards to retain their live-site and
   repository links, so that I can go straight to the project.
4. As a portfolio visitor, I want the Projects index to remain available, so that I can still
   browse the existing collection.
5. As a search crawler, I want the sitemap to leave out retired routes, so that it advertises
   pages that still exist.
6. As a maintainer, I want no first-party routes for individual projects, so that project cards
   and the Projects index are the only ways the portfolio presents its projects.
7. As someone booking a call, I want selectable days to reflect the returned time slots, so
   that clicking a day produces the times for that day.
8. As someone booking a call, I want to see a weekend slot when the provider offers one, so that
   I can book any available time.
9. As someone booking a call, I want an explicit empty state when a month has no slots, so that I
   know to try another month.
10. As someone booking near midnight, I want the choice and confirmation to agree on the date in
    the displayed time zone, so that I know when to attend.
11. As someone changing dates or months, I want my previous time selection cleared when it no
    longer applies, so that I cannot accidentally submit the wrong slot.
12. As someone confirming a call, I want the server to recheck the same instant I chose, so that
    a newly unavailable slot is rejected rather than confirmed.
13. As someone returning from a slot conflict, I want to pick another time without retyping my
    details, so that I can finish booking.
14. As a keyboard visitor, I want the selected date, slot changes, and booking errors to be
    perceivable without animation or color alone, so that I can complete the booking.
15. As a maintainer, I want deterministic booking fixtures, so that I can verify demo and live-like
    behavior without creating real appointments or sending email.
16. As a recruiter, I want the strongest tools to appear in the intended core order, so that I can
    scan the stack quickly.
17. As a recruiter, I want Supabase, Prisma, and other supporting tools in the complete toolkit, so
    that the full range of experience is still available.
18. As a keyboard visitor, I want the complete toolkit to remain keyboard-operable and its
    count accurate, so that I know what I can reveal.
19. As a maintainer, I want each tool's label, destination, usage, and placement to stay together,
    so that promotion or renaming is a local edit.
20. As a visitor with reduced motion enabled at the system level, I want it respected on first
    paint, so that I do not see motion before the page loads.
21. As a visitor who changes the navbar toggle, I want it to apply immediately and persist across
    pages and reloads, so that I can set it once.
22. As a visitor with a saved site preference, I want it to override my system setting, so that
    system changes do not undo my explicit choice.
23. As a visitor who blocks browser storage, I want the toggle to work for the current session,
    so that I still have control.
24. As a visitor with motion off, I want hover and focus feedback to appear instantly and the
    hamburger to open without movement, so that the controls remain usable.
25. As a visitor with motion off or on a device without hover, I want all hobby photos visible without
    hovering, so that I can see the whole gallery.
26. As a visitor who turns motion back on, I want the existing effects to return, so that I can
    choose either experience.

## Implementation Decisions

- Retire `/experience` and eliminate every individual project detail route under
  `/project/:project` and `/projects/:project`. This includes the existing
  `/projects/financeflow` route and any static, dynamic, or catch-all route that could serve
  a project detail page. These URLs return the app's normal not-found response. Remove retired
  routes from the sitemap and route documentation. Do not add replacement pages, redirects, or
  navigation entries. Remove supporting code only after confirming it has no remaining callers.
- Preserve About's career records and company links, the résumé route and PDF, the Projects index,
  and homepage project destinations, order, and preview assets. The FinanceFlow live-site and
  repository links remain available through their current public surfaces.
- Keep the existing availability and booking HTTP interfaces. Centralize how the booking module
  validates calendar inputs, interprets date and month in the effective time zone, normalizes and
  groups slot instants, and decides whether a date or a slot can be selected. The calendar renders
  those results; the booking handler rechecks them using current availability before booking.
- Keep the effective zone precedence of configured booking time zone, browser zone, then New York.
  A calendar date is a date in the effective zone; a slot is an absolute instant. Use the same
  interpretation for display and booking recheck, including where UTC and local months differ.
  Reject invalid calendar inputs as validation errors.
- Initial selection may use the first eligible day. Dates with no slots, including dates outside
  the displayed month, are unavailable. A live weekend slot is selectable. Never swap to another
  day silently in response to the visitor's choice. Clear a stale selected time, expose empty and
  conflict feedback, and let the visitor return to slot selection with their details intact.
- Keep provider requests and booking notifications outside the reusable date and slot rules. Retain
  Calendly, the existing demo/live distinction, booking form requirements, and rate limits. Demo
  flows do not create appointments or send notifications. Tests can substitute provider responses.
- Give the Tool Stack module one record per tool, with stable identity, label, destination, usage,
  and explicit placement and order. Core order is TypeScript, React, Next.js, Node.js, Python,
  Django, PostgreSQL, Snowflake, Docker, and AWS. Keep other tools in their current expanded order,
  including Supabase and Prisma. Derive the disclosure count and prevent duplicates across groups.
- Share motion preference resolution between the before-paint script and the browser preference
  store. A valid saved site override wins over the system preference; an override made while
  storage is unavailable remains effective in memory for that page session. Preserve current
  persisted values, same-tab updates, cross-tab storage updates, and system updates when no
  override exists. CSS and React consume the same effective preference.
- Keep the animation choices local to the affected UI. Off means instant hover and focus feedback,
  a static hamburger and tooltip, no decorative movement or smooth scrolling, and a spread hobby
  gallery. Ordinary navigation, focus cues, and loading feedback still work. Leave the enabled
  effects and layouts as they are today.

## Testing Decisions

- Assert observable behavior through existing interfaces: public routes, the sitemap, rendered
  links and controls, booking HTTP responses, and the navbar toggle. Follow the existing
  Playwright smoke-test pattern. Do not assert on private helpers, implementation structure, or
  CSS class names.
- Verify that `/experience`, the former FinanceFlow URL, and representative arbitrary slugs under
  both `/project/` and `/projects/` return 404. Confirm no individual project detail routes are
  registered or advertised in the sitemap. Verify `/projects` still loads and representative
  project and company links keep their destinations.
- Exercise the booking module through the calendar and existing HTTP interfaces. Use fixed time
  and deterministic provider fixtures for empty dates, weekend slots, a time-zone month rollover,
  invalid input, a slot that disappears at confirmation, and a successful booking. Verify conflict
  recovery retains form values and confirm no live scheduling or email is used in tests.
- Exercise the Tool Stack through About. Assert the ten core tools in display order, no duplicates,
  representative tool details and destinations, and a correct count after keyboard expansion.
- Check motion on desktop and touch viewports. Cover system defaults, saved overrides before
  hydration, reload, live system changes without an override, blocked storage, and toggling while
  the menu is open. Check visible static states and that motion returns when re-enabled.

## Out of Scope

- A new Experience page, project detail pages, case studies, or gallery assets.
- A portfolio redesign, a rewrite of career copy, or changes to the résumé PDF.
- New booking providers, form fields, database schema, or outreach and admin workflows.
- New tools, different tool destinations, or new animation effects.

## Further Notes

- Land the route cleanup, Tool Stack, booking, and motion changes as independently verifiable
  slices. No data migration is required.
- FinanceFlow is the only current example of a project detail route. The requirement applies
  to all project slugs. The Projects index remains a supported route.
