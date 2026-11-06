### Changed

- Two parts leave the text-role backlog (#122, Phase 4): InlineEdit's read view and InputGroup's prefix and suffix now switch to the data font through a modifier of the part (`plx-inline-edit__read--data`, `plx-input-group__affix--data`) instead of a rule on the block, so each part has one whole text contract (secondary role). Nothing looks different (the computed text is unchanged in both directions). Two descendant-selector rules are gone from the style baseline.
