import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const { url } = await request.json()

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 })
        }

        // URLからHTMLを取得
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        })

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch URL" }, { status: 500 })
        }

        const html = await response.text()

        // メタデータを抽出
        const title = extractTitle(html)
        const authors = extractAuthors(html)
        const year = extractYear(html)

        return NextResponse.json({
            title,
            authors,
            year,
        })
    } catch (error) {
        console.error("Error fetching URL:", error)
        return NextResponse.json({ error: "Failed to fetch URL" }, { status: 500 })
    }
}

function extractTitle(html: string): string {
    // OGP title
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)
    if (ogTitleMatch) return decodeHtmlEntities(ogTitleMatch[1])

    // Twitter title
    const twitterTitleMatch = html.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i)
    if (twitterTitleMatch) return decodeHtmlEntities(twitterTitleMatch[1])

    // Regular title tag
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    if (titleMatch) return decodeHtmlEntities(titleMatch[1])

    return ""
}

function extractAuthors(html: string): string {
    // Citation author (for academic pages)
    const citationAuthorMatches = html.match(/<meta[^>]*name=["']citation_author["'][^>]*content=["']([^"']+)["']/gi)
    if (citationAuthorMatches && citationAuthorMatches.length > 0) {
        const authors = citationAuthorMatches.map((match) => {
            const contentMatch = match.match(/content=["']([^"']+)["']/i)
            return contentMatch ? decodeHtmlEntities(contentMatch[1]) : ""
        }).filter(Boolean)
        return authors.join("，")
    }

    // DC.creator
    const dcCreatorMatch = html.match(/<meta[^>]*name=["']DC\.creator["'][^>]*content=["']([^"']+)["']/i)
    if (dcCreatorMatch) return decodeHtmlEntities(dcCreatorMatch[1])

    // Article author (OGP)
    const ogAuthorMatch = html.match(/<meta[^>]*property=["']article:author["'][^>]*content=["']([^"']+)["']/i)
    if (ogAuthorMatch) return decodeHtmlEntities(ogAuthorMatch[1])

    // Author meta tag
    const authorMatch = html.match(/<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["']/i)
    if (authorMatch) return decodeHtmlEntities(authorMatch[1])

    return ""
}

function extractYear(html: string): string {
    // Citation publication date
    const citationDateMatch = html.match(/<meta[^>]*name=["']citation_publication_date["'][^>]*content=["']([^"']+)["']/i)
    if (citationDateMatch) {
        const year = extractYearFromDate(citationDateMatch[1])
        if (year) return year
    }

    // DC.date
    const dcDateMatch = html.match(/<meta[^>]*name=["']DC\.date["'][^>]*content=["']([^"']+)["']/i)
    if (dcDateMatch) {
        const year = extractYearFromDate(dcDateMatch[1])
        if (year) return year
    }

    // Article published time
    const articleTimeMatch = html.match(/<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)["']/i)
    if (articleTimeMatch) {
        const year = extractYearFromDate(articleTimeMatch[1])
        if (year) return year
    }

    // Date meta tag
    const dateMatch = html.match(/<meta[^>]*name=["']date["'][^>]*content=["']([^"']+)["']/i)
    if (dateMatch) {
        const year = extractYearFromDate(dateMatch[1])
        if (year) return year
    }

    return new Date().getFullYear().toString()
}

function extractYearFromDate(dateStr: string): string | null {
    // Try to extract a 4-digit year
    const yearMatch = dateStr.match(/\b(19|20)\d{2}\b/)
    return yearMatch ? yearMatch[0] : null
}

function decodeHtmlEntities(text: string): string {
    return text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .trim()
}
