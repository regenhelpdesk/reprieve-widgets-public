# Changelog

All notable changes to `@regenesismed/widget-commands-manager` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [0.3.0] - 2026-03-14

### Added
- Add public refresh() method to reset all component state
- Add commandDataModelId to widget config and validation
### Changed
- Fix config field descriptions for clarity
- Replace hardcoded IDs in service with config values

---

## [0.2.1] - 2026-03-01

### Added
- Device suggestion dropdown now stays open for multi-selection — click multiple
  entries without the list closing between picks.
- Checkbox UI in suggestions: each item shows a blue filled checkbox when selected,
  empty square when not.
- Command queue limit of 8 per request: the "Add Command" button is disabled when
  the limit is reached, with an amber notice explaining how to proceed.

### Removed
- `ngx-pagination` removed from peer dependencies and from the Angular module
  (unused since the autocomplete device search was introduced in 0.2.0).

---

## [0.2.0] - 2026-02-27

### Added
- **Autocomplete device search**: replaced the flat checkbox list (capped at 1000)
  with a server-side search input. Results are fetched after 2+ characters with a
  300 ms debounce, capped at 20 suggestions.
- Selected devices are displayed as removable chips below the search input.
- "Clear all" button and selected count footer in the Target Devices section.
- `MatrixApiService.searchDevicesForWidget()` method for prefix-based device search.

### Changed
- Device selection state moved from `Set<string>` + flat list to `Device[]` chip list.

---

## [0.1.0] - 2026-02-27

### Added
- Initial release of the Remote Command widget.
- Drag-and-drop command queue with argument inputs (text, number, select, boolean).
- Command search/filter dropdown.
- Send commands to multiple devices via the Matrix API.
