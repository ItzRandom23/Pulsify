# Changelog

## 1.0.0

- Rename the package and client branding to Pulsify.
- Preserve the existing Manager, Player, Node, Queue, and filter APIs.
- Report rejected websocket event promises through the node error handler.
- Use `pulsify/` for new session data, reusing `magmastream/` when upgrading.
- Retain the custom autoplay, queue handling, and session recovery behavior.

This release continues the Magmastream fork maintained by ItzRandom23.
