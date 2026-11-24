# macOS-Inspired Portfolio Shell and Startup Intro

The portfolio should feel like a personal desktop while keeping work, career history, the résumé,
and contact easy to reach. The dark graphite palette, compact menu bar, and framed project
previews carry that style through the public site.

## Startup Intro

- Show a near-black screen with a centered silver IF monogram, a thin progress line, and a visible
  **Skip intro** button. Treat the line as decoration. It follows the intro's timing.
- Play once per tab, when the tab opens directly on the homepage without a section link.
  Refreshes, navigation within the site, and links such as `/resume` and `/#contact` go straight
  to their destination.
- Render the homepage underneath and cap the full intro, including the reveal, at 1,200 ms from
  the moment it appears. The monogram and progress line use inline assets so the intro can appear
  independently of image and font downloads.
- Dismiss immediately when the visitor activates **Skip intro** or presses Escape. If focus is
  inside the intro when it closes, return it to the main content. A timeout during ordinary page
  entry preserves the usual reading order.
- Use the site's existing motion preference. Visitors with reduced motion go straight to the
  homepage. If motion is turned off during the intro, dismiss it immediately.
- Leave the page visible if scripting or session storage is unavailable. Keep the availability of
  page content independent of the intro.

## Portfolio Shell

- Use a compact, opaque graphite menu bar that stays readable while scrolling. Keep the portrait
  as the home link and retain the motion toggle.
- Show **Work**, **About**, **Résumé**, and **Contact** in that order on desktop. On phones, keep
  the portrait and motion toggle in the bar and put the four destinations in the compact menu.
- Give featured work cards subtle window title bars that show each project's real name. Keep
  project previews and their live-site and repository links easy to reach. Simplify the frames on
  phone widths so the preview and links retain space.
- Place the floating social links directly on the footer surface. Use the shared motion preference
  for hover, focus, menu, and dock effects. Keep visible keyboard focus cues in both motion modes.

## Acceptance Checks

- A fresh tab opening `/` shows the intro for 1,200 ms unless dismissed first. Refreshing that
  tab, using the home link, or returning through browser history goes straight to the content.
- A fresh tab opening `/resume`, `/projects`, `/about`, `/#projects`, or `/#contact` reaches the
  requested destination immediately.
- Test **Skip intro** by pointer and keyboard, Escape during playback, and timeout while the button
  has focus. Verify the visitor can continue navigating after the intro closes.
- Test OS reduced motion and a saved site override before hydration. Verify the page remains
  reachable with JavaScript disabled or session storage blocked.
- At desktop and phone widths, check the menu order, scroll legibility, keyboard focus, and project
  destinations. Verify the social links remain usable with motion off.

See the [navigation decision](../adr/0001-keep-startup-intro-independent-of-navigation.md) and
the [portfolio glossary](../../GLOSSARY.md).
