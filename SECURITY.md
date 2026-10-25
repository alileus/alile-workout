# Security

Do not publish vulnerabilities or credentials in public issues. Email [hala@alile.us](mailto:hala@alile.us) or use GitHub private vulnerability reporting when enabled.

The app does not collect accounts, health records, or training histories. Content changes are reviewed in PRs. Keep dependencies updated; never include secrets in content or NEXT_PUBLIC variables.

HTML uses a fresh CSP nonce and dynamic rendering, with no shared HTTP caching.
Preserve both request and response CSP headers when modifying locale routing.
Open Graph images and public anatomy artwork intentionally allow cross-origin
embedding. `NEXT_LOCALE` is a non-secret client-managed preference; it is Secure
in production and intentionally has no HttpOnly flag.
