import { NextResponse } from 'next/server';

async function handler(req, { params }) {
    const { path } = await params;
    const forwardPath = Array.isArray(path) ? path.join("/") : path;

    const url = `https://api.tryezbuild.tech/api/p/${forwardPath}`;

    let body = undefined;
    const method = req.method;

    if (method !== 'GET' && method !== 'HEAD') {
        try {
            body = await req.json();
        } catch (e) {
            console.error("Failed to parse body", e);
        }
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.EASYBUILD_SECRET_KEY || ''}`,
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.text();

        return new NextResponse(data, {
            status: response.status,
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'application/json'
            }
        });
    } catch (error) {
        console.error("Proxy error:", error);
        return new NextResponse(JSON.stringify({ error: "Proxy failed" }), { status: 500 });
    }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
