# Power Automate cloud flows

This repo enables Microsoft's **FlowAgent** MCP server (the `power-automate`
plugin from [microsoft/power-platform-skills](https://github.com/microsoft/power-platform-skills))
through `.claude/settings.json`. When you open the repo in Claude Code and trust
the folder, Claude Code offers to install the marketplace and plugin.

## Prerequisites

```bash
node --version          # v18 or newer
az --version            # Azure CLI
az login                # work account with a Power Automate license
az account get-access-token --resource https://service.flow.microsoft.com
```

An `AADSTS` error from the last command usually means the account has no
Power Automate access.

## Install manually (if not prompted)

Inside a Claude Code session, run these one at a time:

```
/plugin marketplace add microsoft/power-platform-skills
/plugin install power-automate@power-platform-skills
/reload-plugins
```

`/reload-plugins` should report `1 plugin MCP servers`, and `/mcp` should show
`flowagent` as connected. If you get `Plugin "power-automate" not found`, run
`/plugin marketplace update power-platform-skills` and install again.

## Skills

| Skill | Purpose |
|-------|---------|
| `setup` | Checks Node, Azure CLI, login, token access, MCP registration |
| `browse-flows` | Browse environments and flows |
| `create-flow` | Guided flow creation |
| `build-flow` | Build a complete flow from a description |
| `debug-flow` / `diagnose-flow` | Investigate a failed run |
| `manage-flows` | Publish, test, batch operations, inventory |
| `manage-desktop-flows` | List and run desktop (RPA) flows |
| `route-environments` | Environment resolution |

New flows are created **turned off** so they don't run unintentionally; turn
them on in the maker portal or ask the agent to publish/enable them.

## Claude Code on the web (cloud sessions)

The cloud sandbox needs outbound access to these hosts (Network access in the
environment settings):

- `login.microsoftonline.com`, `graph.microsoft.com`
- `service.flow.microsoft.com`, `api.flow.microsoft.com`
- `api.powerplatform.com`, `api.bap.microsoft.com`, `apihub.azure.com`
- `*.dynamics.com` (Dataverse environments), `learn.microsoft.com`

It also needs the Azure CLI installed and signed in (`az login --use-device-code`),
for example from the environment's setup script.
