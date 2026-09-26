import { CognitoJwtVerifier } from "aws-jwt-verify";
import config from "../../amplifyconfiguration.json";
import type { AdminResult } from "./adminTypes";

// The user pool allows self sign-up through the Cognito API even though the dashboard
// hides it, so being signed in is not enough on its own.
const ADMIN_EMAILS = [
    "msussmeierart@gmail.com",
    "colesussmeier@gmail.com",
];

const verifier = CognitoJwtVerifier.create({
    userPoolId: config.aws_user_pools_id,
    clientId: config.aws_user_pools_web_client_id,
    tokenUse: "id",
});

// A failure whose message is written for the person using the dashboard.
export class FriendlyError extends Error {}

async function requireAdmin(idToken: string): Promise<string> {
    let payload: Awaited<ReturnType<typeof verifier.verify>>;
    try {
        payload = await verifier.verify(idToken);
    } catch {
        throw new FriendlyError("You've been signed out. Please sign out and sign back in, then try again.");
    }

    const email = String(payload.email ?? "").toLowerCase();
    const verified = String(payload.email_verified) === "true";
    if (!verified || !ADMIN_EMAILS.includes(email)) {
        throw new FriendlyError(`The account ${email || "you signed in with"} isn't allowed to manage the shop.`);
    }
    return email;
}

export async function asAdmin<T>(
    idToken: string,
    doing: string,
    run: (adminEmail: string) => Promise<T>
): Promise<AdminResult<T>> {
    try {
        const adminEmail = await requireAdmin(idToken);
        return { ok: true, data: await run(adminEmail) };
    } catch (err) {
        if (err instanceof FriendlyError) {
            return { ok: false, error: err.message };
        }
        console.error(`Dashboard failed while ${doing}`, err);
        return { ok: false, error: `Something went wrong while ${doing}. Please wait a minute and try again. If it keeps happening, take a screenshot of this message and send it along.` };
    }
}
