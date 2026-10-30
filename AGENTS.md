# Project rules

- Use the shared Logo component for Brick brand marks; keep its SVG geometry aligned with the favicon to prevent inconsistent branding.- Client dashboard uses Inter (font-dashboard) for body and the dash-* Tailwind colour tokens (from --dashboard-* CSS vars); keeps dashboard styling themeable and separate from public site.
- Admin panel lives in src/pages/admin (AdminPanel nested routes under /admin/*) wrapped by components/admin/AdminLayout, which gates on admin/moderator via has_role; sample data from lib/adminMock is shown only when tables are empty. Old src/pages/Admin.tsx is deprecated reference until removal.
- Design-system building blocks (DS-1..DS-6): use `toast` from components/ui/toast-notifications (not raw sonner), EmptyState, skeletons/, ConfirmDialog/DestructiveConfirmDialog, and admin/StatusBadge (soft|solid|dot) instead of ad-hoc variants; project timeline data goes to project_activity_log (activity_log is the client-portal timeline).
- Production project screens use real projects and ordered project_phases, never sample fallback; useProject shares client_id ownership queries so client views stay consistent.
- Convert enquiries with the staff-only create_project_from_request transaction; unique source_request_id prevents duplicates and is_draft keeps unfinished projects private. Link clients through trusted profiles email matching, not public enquiry ownership claims.
- Store private project notes in staff-only project_internal_notes, not client-readable projects. Project creation emails accept only project IDs, authenticate staff and read stored recipients to prevent arbitrary email sends.

- Project photo objects are private and client reads are scoped to assigned finalized projects; public gallery access is mediated by a token-validating Edge Function, never anonymous table/storage enumeration.
- Store hero_image_url as a private storage path and resolve short-lived signed URLs through ProjectImage; photo_type separates hero images from gallery counts.
- Photo metadata and share activity are recorded by database triggers; upload progress uses authenticated Storage requests and cleans orphan objects on metadata failures.
