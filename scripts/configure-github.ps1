param(
  [string]$Repository = "svg153/slidev-archify-explorer",
  [string]$OwnerLogin = "svg153"
)

$ErrorActionPreference = "Stop"

$metadata = @{
  description = "Explore Archify diagrams interactively from Slidev presentations, with PDF-safe static slides."
  homepage = "https://github.com/$Repository#readme"
  allow_squash_merge = $true
  allow_merge_commit = $false
  allow_rebase_merge = $false
  squash_merge_commit_title = "PR_TITLE"
  squash_merge_commit_message = "PR_BODY"
  delete_branch_on_merge = $true
  allow_auto_merge = $true
  has_issues = $true
  has_discussions = $true
  has_wiki = $false
} | ConvertTo-Json
$metadata | gh api --method PATCH "repos/$Repository" --input - | Out-Null

gh api --method PUT "repos/$Repository/private-vulnerability-reporting" | Out-Null

$topics = @{
  names = @("slidev", "archify", "vue", "visualization", "diagrams", "svg", "developer-tools", "presentations", "typescript")
} | ConvertTo-Json
$topics | gh api --method PUT "repos/$Repository/topics" --input - | Out-Null

$ownerId = [int](gh api "users/$OwnerLogin" --jq .id)
$rulesetName = "main-pull-request"
$ruleset = @{
  name = $rulesetName
  target = "branch"
  enforcement = "active"
  conditions = @{ ref_name = @{ include = @("refs/heads/main"); exclude = @() } }
  rules = @(
    @{type = "deletion"},
    @{type = "non_fast_forward"},
    @{type = "required_linear_history"},
    @{type = "pull_request"; parameters = @{
      dismiss_stale_reviews_on_push = $true
      require_code_owner_review = $true
      require_last_push_approval = $false
      required_approving_review_count = 1
      required_review_thread_resolution = $true
      allowed_merge_methods = @("squash")
    }},
    @{type = "required_status_checks"; parameters = @{
      strict_required_status_checks_policy = $true
      do_not_enforce_on_create = $false
      required_status_checks = @(
        @{context = "test"; integration_id = 15368},
        @{context = "title"; integration_id = 15368},
        @{context = "commits"; integration_id = 15368}
      )
    }}
  )
  # Only the owner can bypass the main-branch rules, including direct-push restrictions.
  bypass_actors = @(@{actor_id = $ownerId; actor_type = "User"; bypass_mode = "always"})
} | ConvertTo-Json -Depth 10

$existing = (gh api "repos/$Repository/rulesets" | ConvertFrom-Json | Where-Object name -eq $rulesetName | Select-Object -First 1)
if ($existing) {
  $ruleset | gh api --method PUT "repos/$Repository/rulesets/$($existing.id)" --input - | Out-Null
} else {
  $ruleset | gh api --method POST "repos/$Repository/rulesets" --input - | Out-Null
}

$labels = @(
  @{name="type:feature"; color="1d76db"; description="User-visible feature"},
  @{name="type:bug"; color="d73a4a"; description="Defect or regression"},
  @{name="type:docs"; color="0075ca"; description="Documentation"},
  @{name="type:chore"; color="6f42c1"; description="Maintenance or tooling"},
  @{name="type:research"; color="d4c5f9"; description="Investigation or proof of concept"},
  @{name="area:component"; color="0e8a16"; description="Archify Explorer component"},
  @{name="area:slidev"; color="5319e7"; description="Slidev integration and demo"},
  @{name="area:demo"; color="0e8a16"; description="Example presentation and visual assets"},
  @{name="area:archify"; color="fbca04"; description="Archify diagrams and viewer"},
  @{name="area:docs"; color="cfd3d7"; description="Documentation and assets"},
  @{name="area:release"; color="0052cc"; description="Release automation"},
  @{name="area:governance"; color="5319e7"; description="Repository policy and contributor workflow"},
  @{name="priority:p1"; color="b60205"; description="Highest priority"},
  @{name="priority:p2"; color="d93f0b"; description="Normal priority"},
  @{name="priority:p3"; color="0e8a16"; description="Nice to have"}
)
foreach ($label in $labels) {
  gh label create $label.name --repo $Repository --color $label.color --description $label.description --force | Out-Null
}

Write-Output "Configured repository metadata, topics, labels, and the main-pull-request ruleset for $Repository."
