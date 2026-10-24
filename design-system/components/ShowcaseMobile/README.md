# ShowcaseMobile

ShowcaseMobile shows three screens at 390px, in the comfortable density:

1. **View**: only two islands remain at the top, brand and menu; the menu holds the project scope (Picks, Sources, Export, Queue) as its own group, so no task disappears. The stage toolbar has a frame-navigation group on the left and a separate "Use" on the right; below the stage, an opaque thumbnail strip (content, not glass), then the composer and, at the very bottom, the tab bar with the same main destinations as the desktop brand island (Studio, Library, Shows). The composer is an instruction field for the assistant, not search; it sits directly above the tab bar as its accessory, so the tab bar doesn't add a search button.
2. **Inspector as a half-height sheet**: thick glass, inset from the screen edges, showing the stage beneath; when content grows to full height it becomes opaque and meets the screen edges.
3. **Inline confirmation**: the menu grows from the "More" button in the top-right corner of the stage, and the destructive action is confirmed inside the menu; the rest of the stage stays usable.

Each screen has at most 7 backdrop blurs.

These are showcase cards at a fixed size, not a layout reference. For a layout that works from 320px to wide desktop, use AppShell.
