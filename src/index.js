#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const TOOLS = [
  {
    "name": "metaRoot",
    "description": "GET / · GitHub API Root",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "securityAdvisoriesListGlobalAdvisories",
    "description": "GET /advisories · List global security advisories",
    "inputSchema": {
      "type": "object",
      "properties": {
        "ghsa_id": {
          "type": "string"
        },
        "type": {
          "type": "string"
        },
        "cve_id": {
          "type": "string"
        },
        "ecosystem": {
          "type": "string"
        },
        "severity": {
          "type": "string"
        },
        "cwes": {
          "type": "string"
        },
        "is_withdrawn": {
          "type": "string"
        },
        "affects": {
          "type": "string"
        },
        "published": {
          "type": "string"
        },
        "updated": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "securityAdvisoriesGetGlobalAdvisory",
    "description": "GET /advisories/{ghsa_id} · Get a global security advisory",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "agentTasksListTasksForRepo",
    "description": "GET /agents/repos/{owner}/{repo}/tasks · List tasks for repository",
    "inputSchema": {
      "type": "object",
      "properties": {
        "owner": {
          "type": "string"
        },
        "repo": {
          "type": "string"
        },
        "per_page": {
          "type": "string"
        },
        "page": {
          "type": "string"
        },
        "sort": {
          "type": "string"
        },
        "direction": {
          "type": "string"
        },
        "state": {
          "type": "string"
        },
        "is_archived": {
          "type": "string"
        },
        "since": {
          "type": "string"
        },
        "creator_id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "agentTasksCreateTaskInRepo",
    "description": "POST /agents/repos/{owner}/{repo}/tasks · Start a task",
    "inputSchema": {
      "type": "object",
      "properties": {
        "owner": {
          "type": "string"
        },
        "repo": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "agentTasksGetTaskByRepoAndId",
    "description": "GET /agents/repos/{owner}/{repo}/tasks/{task_id} · Get a task by repo",
    "inputSchema": {
      "type": "object",
      "properties": {
        "owner": {
          "type": "string"
        },
        "repo": {
          "type": "string"
        },
        "task_id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "agentTasksListTasks",
    "description": "GET /agents/tasks · List tasks",
    "inputSchema": {
      "type": "object",
      "properties": {
        "per_page": {
          "type": "string"
        },
        "page": {
          "type": "string"
        },
        "sort": {
          "type": "string"
        },
        "direction": {
          "type": "string"
        },
        "state": {
          "type": "string"
        },
        "is_archived": {
          "type": "string"
        },
        "since": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "agentTasksGetTaskById",
    "description": "GET /agents/tasks/{task_id} · Get a task by ID",
    "inputSchema": {
      "type": "object",
      "properties": {
        "task_id": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "appsGetAuthenticated",
    "description": "GET /app · Get the authenticated app",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "appsCreateFromManifest",
    "description": "POST /app-manifests/{code}/conversions · Create a GitHub App from a manifest",
    "inputSchema": {
      "type": "object",
      "properties": {
        "code": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "appsGetWebhookConfigForApp",
    "description": "GET /app/hook/config · Get a webhook configuration for an app",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "appsUpdateWebhookConfigForApp",
    "description": "PATCH /app/hook/config · Update a webhook configuration for an app",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "appsListWebhookDeliveries",
    "description": "GET /app/hook/deliveries · List deliveries for an app webhook",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "appsGetWebhookDelivery",
    "description": "GET /app/hook/deliveries/{delivery_id} · Get a delivery for an app webhook",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "appsRedeliverWebhookDelivery",
    "description": "POST /app/hook/deliveries/{delivery_id}/attempts · Redeliver a delivery for an app webhook",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "appsListInstallationRequestsForAuthenticatedApp",
    "description": "GET /app/installation-requests · List installation requests for the authenticated app",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "appsListInstallations",
    "description": "GET /app/installations · List installations for the authenticated app",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        },
        "outdated": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "appsGetInstallation",
    "description": "GET /app/installations/{installation_id} · Get an installation for the authenticated app",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "appsDeleteInstallation",
    "description": "DELETE /app/installations/{installation_id} · Delete an installation for the authenticated app",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "appsCreateInstallationAccessToken",
    "description": "POST /app/installations/{installation_id}/access_tokens · Create an installation access token for an app",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "appsSuspendInstallation",
    "description": "PUT /app/installations/{installation_id}/suspended · Suspend an app installation",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "appsUnsuspendInstallation",
    "description": "DELETE /app/installations/{installation_id}/suspended · Unsuspend an app installation",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "appsDeleteAuthorization",
    "description": "DELETE /applications/{client_id}/grant · Delete an app authorization",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "appsCheckToken",
    "description": "POST /applications/{client_id}/token · Check a token",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "appsResetToken",
    "description": "PATCH /applications/{client_id}/token · Reset a token",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "appsDeleteToken",
    "description": "DELETE /applications/{client_id}/token · Delete an app token",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "appsScopeToken",
    "description": "POST /applications/{client_id}/token/scoped · Create a scoped access token",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "appsGetBySlug",
    "description": "GET /apps/{app_slug} · Get an app",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "classroomGetAnAssignment",
    "description": "GET /assignments/{assignment_id} · Get an assignment",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "classroomListAcceptedAssignmentsForAnAssignment",
    "description": "GET /assignments/{assignment_id}/accepted_assignments · List accepted assignments for an assignment",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "classroomGetAssignmentGrades",
    "description": "GET /assignments/{assignment_id}/grades · Get assignment grades",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "classroomListClassrooms",
    "description": "GET /classrooms · List classrooms",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "classroomGetAClassroom",
    "description": "GET /classrooms/{classroom_id} · Get a classroom",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "classroomListAssignmentsForAClassroom",
    "description": "GET /classrooms/{classroom_id}/assignments · List assignments for a classroom",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "codesOfConductGetAllCodesOfConduct",
    "description": "GET /codes_of_conduct · Get all codes of conduct",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "codesOfConductGetConductCode",
    "description": "GET /codes_of_conduct/{key} · Get a code of conduct",
    "inputSchema": {
      "type": "object",
      "properties": {
        "key": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "credentialsRevoke",
    "description": "POST /credentials/revoke · Revoke a list of credentials",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "emojisGet",
    "description": "GET /emojis · Get emojis",
    "inputSchema": {
      "type": "object",
      "properties": {}
    }
  },
  {
    "name": "actionsGetActionsCacheRetentionLimitForEnterprise",
    "description": "GET /enterprises/{enterprise}/actions/cache/retention-limit · Get GitHub Actions cache retention limit for an enterprise",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "actionsSetActionsCacheRetentionLimitForEnterprise",
    "description": "PUT /enterprises/{enterprise}/actions/cache/retention-limit · Set GitHub Actions cache retention limit for an enterprise",
    "inputSchema": {
      "type": "object",
      "properties": {
        "undefined": {
          "type": "string"
        }
      }
    }
  }
];
const UPSTREAM = process.env.UPSTREAM || 'https://api.github.com';
const APIKEY = process.env.GITHUB_KEY || process.env.API_KEY || '';

const server = new Server({ name: 'github-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const tool = TOOLS.find(t => t.name === req.params.name);
  if (!tool) throw new Error('unknown tool');
  const args = req.params.arguments || {};
  const path = tool.description.match(/(GET|POST|PUT|PATCH|DELETE) (\S+)/) || [];
  const method = path[1] || 'GET';
  let url = new URL(path[2] || '/', UPSTREAM);
  for (const [k, v] of Object.entries(args)) if (typeof v === 'string' && url.pathname.includes('{' + k + '}')) url.pathname = url.pathname.replace('{' + k + '}', v);
  const opts = { method, headers: { Authorization: APIKEY ? 'Bearer ' + APIKEY : '' } };
  if (method !== 'GET' && Object.keys(args).length) { opts.body = JSON.stringify(args); opts.headers['Content-Type'] = 'application/json'; }
  const res = await fetch(url, opts);
  const txt = await res.text();
  return { content: [{ type: 'text', text: txt.slice(0, 4000) }] };
});

await server.connect(new StdioServerTransport());
console.error('github-mcp v1.0.0 · stdio ready · 40 tools');
