# Project rules

- Use the shared Logo component for Brick brand marks; keep its SVG geometry aligned with the favicon to prevent inconsistent branding.- Client dashboard uses Inter (font-dashboard) for body and the dash-* Tailwind colour tokens (from --dashboard-* CSS vars); keeps dashboard styling themeable and separate from public site.
- Admin panel lives in src/pages/admin (AdminPanel nested routes under /admin/*) wrapped by components/admin/AdminLayout, which gates on admin/moderator via has_role; sample data from lib/adminMock is shown only when tables are empty. Old src/pages/Admin.tsx is deprecated reference until removal.
- Design-system building blocks (DS-1..DS-6): use `toast` from components/ui/toast-notifications (not raw sonner), EmptyState, skeletons/, ConfirmDialog/DestructiveConfirmDialog, and admin/StatusBadge (soft|solid|dot) instead of ad-hoc variants; project timeline data goes to project_activity_log (activity_log is the client-portal timeline).
