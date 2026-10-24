# Materials

A side-by-side comparison of six key glass decisions, each pair marked "Don't" and "Do":

1. **Scroll edge**: whether `lg-scroll-edge` is added when content scrolls under the nav island.
2. **Thick glass for overlays**: the difference between regular 0.5 glass and `glass-thick` when a menu covers white content and photos.
3. **Stage scrim**: whether labels on the stage sit inside a scrim band (full strength over 64px at the top and 88px at the bottom, never more than 25% of a short stage; a band appears only where controls are); captions in the middle of the frame use `lg-plate`.
4. **Background extension**: a sidebar floating over empty canvas, versus using `lg-extend` to mirror the adjacent hero image, blur it and extend it under the sidebar (the sidebar uses `lg-glass--thick`).
5. **Two strengths**: Restrained (default) and Stronger (`data-glass="strong"`).
6. **Three fallback tiers**: refraction + blur, blur + highlight, opaque `surface`.

Switch the theme at the top of the page to see how the Solid and high-contrast themes make all glass opaque and remove the background extension; tier 2 refraction is visible only in Chromium-based browsers, and only when there is a pattern behind the glass.
