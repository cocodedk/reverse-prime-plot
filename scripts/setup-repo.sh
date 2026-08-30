#!/bin/sh
# scripts/setup-repo.sh
# Applies repository settings and branch protection.
# Prerequisites: gh CLI authenticated with admin rights on the repo.
# Run AFTER the first CI workflow run so the status check name is registered.
set -eu

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
DEFAULT_BRANCH=$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)
OWNER=$(gh repo view --json owner -q .owner.login)

echo ""
echo "=== Repository Setup: $REPO ==="
echo ""

gh repo edit "$REPO" \
  --delete-branch-on-merge \
  --enable-squash-merge \
  --enable-rebase-merge \
  --enable-merge-commit=false

echo "✓ Merge strategy: squash + rebase only, auto-delete head branches"

# "contexts" must match the job name in ci.yml.
PROTECTION_PAYLOAD='{
  "required_status_checks": { "strict": true, "contexts": ["verify"] },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": false,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 0
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_linear_history": false,
  "required_conversation_resolution": false,
  "lock_branch": false,
  "block_creations": false
}'

set +e
PROT_RESP=$(printf '%s' "$PROTECTION_PAYLOAD" | gh api \
  --method PUT "/repos/$REPO/branches/$DEFAULT_BRANCH/protection" --input - 2>&1)
PROT_RC=$?
set -e

if [ "$PROT_RC" -eq 0 ]; then
  echo "✓ Branch protection rules set on $DEFAULT_BRANCH"
elif echo "$PROT_RESP" | grep -q "Upgrade to GitHub Pro"; then
  echo "⚠  Branch protection skipped: private repo on GitHub Free."
  echo "   The local pre-push hook is the only guard — keep it installed."
else
  echo "✗ Branch protection failed:" >&2
  echo "$PROT_RESP" >&2
  exit 1
fi

mkdir -p .github
printf '# All files — repo owner auto-requested for review.\n* @%s\n' "$OWNER" \
  > .github/CODEOWNERS
echo "✓ .github/CODEOWNERS written"
