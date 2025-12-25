
import { gatewayRequest } from "./gateway";

export async function uploadFile(file, session) {
    return gatewayRequest(
        {
            intent: "storage.write",
            capability: "supabase.storage.upload",
            resource: {
                bucket: "avatars",
                path: `${session.access_token.slice(0, 8)}-${file.name}`,
            },
            payload: {
                file,
                contentType: file.type,
            },
        },
        session
    );
}

export async function deleteFile(path, session) {
    return gatewayRequest(
        {
            intent: "storage.delete",
            capability: "supabase.storage.delete",
            resource: {
                bucket: "avatars",
                path,
            },
        },
        session
    );
}

export async function downloadFile(path, session) {
    const res = await gatewayRequest({
        intent: "storage.read",
        capability: "supabase.storage.download",
        resource: {
            bucket: "avatars",
            path,
        },
    }, session, { blob: true });

    return res;
}

export async function listFiles(path = "", session) {
    return gatewayRequest(
        {
            intent: "storage.read",
            capability: "supabase.storage.list",
            resource: { bucket: "avatars" },
            payload: { path, limit: 10 },
        },
        session
    );
}
