---
name: commit
description: Commits work following this project's commit conventions - a type prefix such as "feat:" with no scope in parentheses, small single-purpose commits, no Co-Authored-By line and no push. Use only when the user asks to commit; never commit on your own after a task.
---

# Commit

Commit only when the user asks for it. When they do, follow the rules below.

## Rules

- Every commit message starts with `feat: ` or another type (`fix`, `add`, `chore`, `docs`, `refactor`…), with no scope in parentheses, whatever the kind of change.
  Example: `feat: stop sending answers left blank`
- Always prefer small commits: split each group of changes into the smallest meaningful units (one component, one fix, one config change, one doc topic), and make sure every commit builds and passes lint on its own.
- Never mix unrelated changes (for example a new feature and a bug fix) in the same commit.
- Never add `Co-Authored-By` lines to commit messages.
- Never push without prior authorization.
- Never add claude with colaborator in the project.

## Message format

```
<type>: <description>
```

| Type | Use for |
| --- | --- |
| `feat` | A new feature or behavior |
| `fix` | A bug fix |
| `docs` | Documentation only, including `.docs/` |
| `style` | Formatting with no change in behavior |
| `refactor` | Restructuring with no change in behavior |
| `perf` | A performance improvement |
| `test` | Adding or fixing tests |
| `build` | Build tooling or dependencies |
| `ci` | CI/CD configuration |
| `chore` | Maintenance that fits no other type |
| `revert` | Reverting an earlier commit |

- Write `feat: add castling validation`, never `feat(board): add castling validation`.
- Write the description in English, in the imperative, lowercase, with no trailing period.
- Add a body, separated by a blank line, only when the reason for the change is not obvious from the description.
