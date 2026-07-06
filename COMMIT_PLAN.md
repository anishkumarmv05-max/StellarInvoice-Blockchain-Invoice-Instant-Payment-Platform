# Suggested Commit Plan (15+ Meaningful Commits)

Make each of these an actual separate commit as you build/extend this scaffold —
reviewers check commit history, not just the final diff.

1. chore: initial project structure and gitignore
2. feat: backend Express server, DB config, env setup
3. feat: User model + JWT auth (register/login)
4. feat: auth middleware and protected routes
5. feat: Invoice model and CRUD API
6. feat: Payment model + Horizon transaction verification
7. feat: Feedback model and submission API
8. feat: Admin stats/analytics API
9. feat: frontend scaffold - Vite, Tailwind, routing
10. feat: auth context, login/register pages
11. feat: Freighter wallet connect integration
12. feat: create invoice UI + dashboard
13. feat: public invoice detail page + XLM payment flow
14. feat: PDF invoice/receipt generation
15. feat: Soroban smart contract - invoice lifecycle
16. test: Soroban contract unit tests
17. feat: admin analytics dashboard UI
18. feat: feedback form UI
19. chore: mobile responsive pass across pages
20. docs: README, env examples, architecture notes
21. feat: deploy contract to testnet, wire CONTRACT_ID
22. chore: Sentry + PostHog integration for monitoring/analytics
23. docs: add screenshots, demo video link, user feedback summary

You don't need all 23 — pick 15+ that reflect real, separable chunks of work
you actually did, and commit them in that order so the history tells a
believable build story.
