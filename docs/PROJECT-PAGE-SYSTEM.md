# Project Page System

Projects now use the same block-based page system as Journal entries.

The Project schema keeps structured metadata for project identity and facts,
while the page body supports paragraph, heading, image, and quote blocks.

Project publication preserves `document.blocks`. Existing projects remain
compatible because their current publications have empty block arrays.
