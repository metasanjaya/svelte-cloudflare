/// <reference types="@cloudflare/workers-types" />
import { DurableObject } from "cloudflare:workers";
import sv from "../.svelte-kit/cloudflare/_worker.js";

export interface Env {
	MY_DURABLE_OBJECT: DurableObjectNamespace;
	ASSETS: Fetcher;
}

export class MyDurableObject extends DurableObject {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	async sayHello(name: string): Promise<string> {
		return `Hello, ${name}!`;
	}
}

export default {
	scheduled: async (controller: ScheduledController, env: Env, ctx: ExecutionContext) => {
		// do cloudflare cron tasks here
	},

	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// Handle API requests
		// if (url.pathname.startsWith('/api/')) {
		// 	return await handleApiRequest(request, env, ctx);
		// }

		// Default sveltekit handler
		return sv.fetch(request, env, ctx);
	},
} satisfies ExportedHandler<Env>;
