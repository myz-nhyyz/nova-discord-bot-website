/* ============================================================
   NOVA — Official site script
   Language switch · Features · Command directory · Search
   Discord-style Help Menu preview · Modals · Ambient canvas
   ============================================================ */
"use strict";

const CONFIG = {
    BOT_NAME: "Nova",
    BOT_OWNER: "nova_.inovation",
    BOT_AVATAR: "assets/avatar.png",
    BOT_INVITE_URL:
        "https://discord.com/oauth2/authorize?client_id=1532745879944036523",
    CONTACT_EMAIL: "anhbao27072011@gmail.com",
    SUPPORT_SERVER_URL: "https://discord.gg/qkyu3G6WMa",
    AI_PROVIDER: "Qwen3.7-max",
    EFFECTIVE_DATE: "19/09/2026"
};

/* ---------------- helpers ---------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const REDUCED = typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let LANG = "vi";
const t = (obj) => (obj && obj[LANG] !== undefined ? obj[LANG] : obj && obj.vi);

function storeSet(key, val) {
    try { localStorage.setItem(key, val); } catch (e) { /* private mode */ }
}
function storeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
}

const esc = (s) => String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/* inline markdown-lite: `code` and **bold** */
function md(s) {
    return esc(s)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");
}

/* ---------------- i18n: static shell strings ---------------- */
const I18N = {
    vi: {
        "doc.title": "Nova — AI Discord Bot",
        "nav.home": "Trang chủ",
        "nav.features": "Tính năng",
        "nav.commands": "Lệnh",
        "nav.help": "Trợ giúp",
        "nav.privacy": "Bảo mật",
        "nav.terms": "Điều khoản",
        "nav.invite": "Mời Nova",
        "nav.menuAria": "Mở menu điều hướng",
        "nav.segAria": "Chọn ngôn ngữ",
        "skip": "Đi tới nội dung chính",

        "hero.kicker": "Discord Bot · Trợ lý AI",
        "hero.sub": "Trợ lý Discord thông minh của bạn — chat AI, tạo ảnh AI, điều phối War/Backup, tổ chức sự kiện, bảo vệ Ban Zone, kiểm duyệt và quản lý máy chủ.",
        "hero.desc": "Nova chạy trên mô hình <strong>Qwen3.7-max</strong>, phản hồi bằng tiếng Việt và tiếng Anh, hoạt động 24/7 với hệ thống lệnh slash lẫn prefix.",
        "btn.invite": "Mời Nova",
        "btn.support": "Tham gia Support Server",
        "btn.explore": "Khám phá tính năng",
        "hero.meta1": "Đang hoạt động",
        "hero.meta2": "Qwen3.7-max",
        "hero.meta3": "VI · EN",
        "hero.channel": "ai-chat",
        "hero.stageAria": "Avatar Nova với các mô-đun tính năng xoay quanh",
        "hero.chatAria": "Xem trước hội thoại Discord với Nova",

        "stat.n1": "hệ thống tính năng",
        "stat.n2": "lệnh & nút bấm",
        "stat.n3": "lệnh AI",
        "stat.n4": "mô hình công khai",
        "stat.n5": "ngôn ngữ hỗ trợ",

        "feat.kicker": "Tính năng",
        "feat.title": "8 hệ thống, một con bot",
        "feat.lead": "Nhấn vào từng thẻ để xem chi tiết đầy đủ: mô tả, danh sách lệnh, quyền hạn và ví dụ sử dụng.",
        "feat.open": "Xem chi tiết",
        "feat.cmdsSuffix": "lệnh",

        "cmd.kicker": "Command Directory",
        "cmd.title": "Toàn bộ lệnh của Nova",
        "cmd.lead": "Tìm kiếm tức thì trên tên lệnh, mô tả, quyền hạn và chuyên mục — hoặc lọc theo nhóm.",
        "cmd.searchPh": "Thử: info, chat, ban, warping…",
        "cmd.searchLabel": "Tìm kiếm lệnh và tính năng",
        "cmd.all": "Tất cả",
        "cmd.total": "lệnh",
        "cmd.found": "lệnh khớp",
        "cmd.foundOne": "lệnh khớp",
        "cmd.noneTitle": "Không có kết quả phù hợp",
        "cmd.noneBody": "Thử một từ khóa khác, hoặc chọn nhanh:",
        "cmd.srCommands": "Lệnh",
        "cmd.srFeatures": "Chuyên mục tính năng",
        "cmd.srHelp": "Chủ đề trợ giúp",
        "cmd.typePrefix": "Prefix",
        "cmd.typeSlash": "Slash",
        "cmd.typeButton": "Nút bấm",
        "cmd.permLabel": "Cần quyền",
        "cmd.exampleLabel": "Ví dụ",
        "cmd.newBadge": "MỚI",
        "cmd.ownerBadge": "OWNER",
        "cmd.viewInDir": "Xem trong thư mục",

        "help.kicker": "Help System",
        "help.title": "Menu trợ giúp giống hệt trong Discord",
        "help.lead": "Bản xem trước tương tác của <code>!help</code> — chọn một category trong dropdown để xem nội dung thật. Bên dưới là mô phỏng <code>!help &lt;feature&gt;</code>.",
        "help.selectLabel": "Chọn category để xem chi tiết",
        "help.ownerToggle": "Mô phỏng quyền bot owner",
        "help.ownerNote": "Category 🔐 Admin chỉ hiển thị lệnh khi bạn bật chế độ mô phỏng owner — giống hệt cách Nova ẩn lệnh admin với người dùng thường.",
        "help.previewTitle": "Bản xem trước Nova Help Menu",
        "help.detailHead": "Chi tiết category",
        "help.lockedTitle": "🔐 Admin — Chỉ dành cho Bot Owner",
        "help.lockedBody": "Category này chứa các lệnh quản lý Cocolink API key và khởi động lại bot. Nova chỉ hiển thị chúng cho chủ nhân của bot. Bật công tắc mô phỏng owner để xem.",
        "help.simTitle": "Mô phỏng !help <feature>",
        "help.simLead": "Gõ tên một tính năng — Nova chỉ hiển thị trợ giúp chi tiết của đúng tính năng đó, không xổ ra cả category.",
        "help.simPh": "info",
        "help.simSend": "Xem",
        "help.simHint": "Thử nhanh:",
        "help.unknownTitle": "❓ Không tìm thấy tính năng",
        "help.unknownBody": "Nova không tìm thấy tính năng đó. Hãy thử một trong các tên sau:",

        "cta.kicker": "Sẵn sàng?",
        "cta.title": "Đưa Nova vào server của bạn ngay hôm nay",
        "cta.body": "Thêm Nova miễn phí — AI chat, tạo ảnh, War/Backup, Event, Ban Zone và đầy đủ công cụ quản lý, thiết lập chỉ trong vài giây.",
        "cta.note": "Miễn phí · Không cần thẻ · Slash + Prefix commands",

        "foot.tag": "Trợ lý Discord thông minh — AI chat, tạo ảnh AI, War/Backup, sự kiện, Ban Zone và quản lý máy chủ.",
        "foot.owner": "Sở hữu & vận hành bởi",
        "foot.product": "Sản phẩm",
        "foot.legal": "Pháp lý",
        "foot.supportH": "Hỗ trợ",
        "foot.contact": "Liên hệ",
        "foot.privacy": "Chính sách bảo mật",
        "foot.terms": "Điều khoản dịch vụ",
        "foot.supportServer": "Support Server",
        "foot.rights": "Đã đăng ký bản quyền.",
        "foot.made": "Thiết kế dành riêng cho Discord",

        "modal.cmdsTitle": "Lệnh liên quan",
        "modal.permsTitle": "Quyền hạn",
        "modal.examplesTitle": "Ví dụ",
        "modal.notesTitle": "Lưu ý",
        "modal.closeAria": "Đóng hộp thoại",
        "modal.inviteCta": "Mời Nova dùng thử",
        "modal.escHint": "Esc để đóng",

        "legal.back": "← Về trang chủ",
        "legal.effective": "Hiệu lực từ"
    },
    en: {
        "doc.title": "Nova — AI Discord Bot",
        "nav.home": "Home",
        "nav.features": "Features",
        "nav.commands": "Commands",
        "nav.help": "Help",
        "nav.privacy": "Privacy",
        "nav.terms": "Terms",
        "nav.invite": "Invite Nova",
        "nav.menuAria": "Open navigation menu",
        "nav.segAria": "Choose language",
        "skip": "Skip to main content",

        "hero.kicker": "Discord Bot · AI Assistant",
        "hero.sub": "Your intelligent Discord assistant for AI chat, AI image generation, War/Backup coordination, Events, Ban Zone protection, moderation, and server management.",
        "hero.desc": "Nova runs on the <strong>Qwen3.7-max</strong> model, replies in Vietnamese and English, and works 24/7 with both slash and prefix commands.",
        "btn.invite": "Invite Nova",
        "btn.support": "Join Support Server",
        "btn.explore": "Explore Features",
        "hero.meta1": "Online",
        "hero.meta2": "Qwen3.7-max",
        "hero.meta3": "VI · EN",
        "hero.channel": "ai-chat",
        "hero.stageAria": "Nova avatar surrounded by feature modules",
        "hero.chatAria": "Discord conversation preview with Nova",

        "stat.n1": "feature systems",
        "stat.n2": "commands & buttons",
        "stat.n3": "AI commands",
        "stat.n4": "public AI model",
        "stat.n5": "supported languages",

        "feat.kicker": "Features",
        "feat.title": "Eight systems, one bot",
        "feat.lead": "Click any card for the full breakdown: description, command list, required permissions and usage examples.",
        "feat.open": "Open details",
        "feat.cmdsSuffix": "cmds",

        "cmd.kicker": "Command Directory",
        "cmd.title": "Every Nova command",
        "cmd.lead": "Instant search across command names, descriptions, permissions and categories — or filter by group.",
        "cmd.searchPh": "Try: info, chat, ban, warping…",
        "cmd.searchLabel": "Search commands and features",
        "cmd.all": "All",
        "cmd.total": "commands",
        "cmd.found": "commands matched",
        "cmd.foundOne": "command matched",
        "cmd.noneTitle": "No matching results",
        "cmd.noneBody": "Try another keyword, or pick one:",
        "cmd.srCommands": "Commands",
        "cmd.srFeatures": "Feature categories",
        "cmd.srHelp": "Help topics",
        "cmd.typePrefix": "Prefix",
        "cmd.typeSlash": "Slash",
        "cmd.typeButton": "Button",
        "cmd.permLabel": "Requires",
        "cmd.exampleLabel": "Example",
        "cmd.newBadge": "NEW",
        "cmd.ownerBadge": "OWNER",
        "cmd.viewInDir": "View in directory",

        "help.kicker": "Help System",
        "help.title": "The help menu, just like in Discord",
        "help.lead": "An interactive preview of <code>!help</code> — pick a category from the dropdown to see real content. Below it, a <code>!help &lt;feature&gt;</code> simulator.",
        "help.selectLabel": "Pick a category to view details",
        "help.ownerToggle": "Simulate bot owner",
        "help.ownerNote": "The 🔐 Admin category only lists its commands when owner simulation is on — exactly how Nova hides admin commands from regular users.",
        "help.previewTitle": "Nova Help Menu preview",
        "help.detailHead": "Category details",
        "help.lockedTitle": "🔐 Admin — Bot Owner only",
        "help.lockedBody": "This category holds Cocolink API-key management and bot restart commands. Nova only shows them to the bot's owner. Flip the owner switch to peek.",
        "help.simTitle": "!help <feature> simulator",
        "help.simLead": "Type a feature name — Nova replies with detailed help for that feature only, never the whole category.",
        "help.simPh": "info",
        "help.simSend": "Show",
        "help.simHint": "Quick try:",
        "help.unknownTitle": "❓ Feature not found",
        "help.unknownBody": "Nova couldn't find that feature. Try one of these:",

        "cta.kicker": "Ready?",
        "cta.title": "Bring Nova to your server today",
        "cta.body": "Add Nova for free — AI chat, image generation, War/Backup, Events, Ban Zone and a full management toolkit, set up in seconds.",
        "cta.note": "Free · No card required · Slash + Prefix commands",

        "foot.tag": "The intelligent Discord assistant — AI chat, AI images, War/Backup, events, Ban Zone protection and server management.",
        "foot.owner": "Owned & maintained by",
        "foot.product": "Product",
        "foot.legal": "Legal",
        "foot.supportH": "Support",
        "foot.contact": "Contact",
        "foot.privacy": "Privacy Policy",
        "foot.terms": "Terms of Service",
        "foot.supportServer": "Support Server",
        "foot.rights": "All rights reserved.",
        "foot.made": "Crafted for Discord",

        "modal.cmdsTitle": "Related commands",
        "modal.permsTitle": "Permissions",
        "modal.examplesTitle": "Examples",
        "modal.notesTitle": "Notes",
        "modal.closeAria": "Close dialog",
        "modal.inviteCta": "Invite Nova now",
        "modal.escHint": "Esc to close",

        "legal.back": "← Back to home",
        "legal.effective": "Effective date"
    }
};

const L = (key) => I18N[LANG][key] || I18N.vi[key] || key;

/* ---------------- category meta ---------------- */
const CATS = {
    ai: { emoji: "🤖", name: { vi: "AI Chatbot", en: "AI Chatbot" } },
    mod: { emoji: "🛡️", name: { vi: "Moderation", en: "Moderation" } },
    banzone: { emoji: "☠️", name: { vi: "Ban Zone", en: "Ban Zone" } },
    war: { emoji: "⚔️", name: { vi: "War Ping / Backup Ping", en: "War Ping / Backup Ping" } },
    event: { emoji: "🏆", name: { vi: "Tạo event", en: "Create events" } },
    info: { emoji: "📊", name: { vi: "Thông tin server", en: "Server Information" } },
    config: { emoji: "⚙️", name: { vi: "Cấu hình", en: "Configuration" } },
    help: { emoji: "📖", name: { vi: "Hệ thống trợ giúp", en: "Help System" } },
    admin: { emoji: "🔐", name: { vi: "Admin (Owner)", en: "Admin (Owner)" } }
};

/* ---------------- feature categories ---------------- */
const FEATURES = [
    {
        id: "ai", size: 3,
        title: { vi: "🤖 AI Chatbot", en: "🤖 AI Chatbot" },
        tag: { vi: "Chat · Tạo ảnh · Persona", en: "Chat · Image · Persona" },
        desc: { vi: "Trò chuyện với AI ngay trong Discord — kèm tạo ảnh, persona riêng và kênh AI tự động.", en: "Chat with AI directly inside Discord — with image generation, personas and automatic AI channels." },
        intro: {
            vi: "Nova tích hợp AI sâu vào Discord: chat trực tiếp, tạo ảnh từ văn bản, cá nhân hóa tính cách AI và cấu hình kênh AI. Mỗi người dùng có lịch sử hội thoại riêng; kênh có thể bật lịch sử dùng chung.",
            en: "Nova is deeply integrated with AI: direct chat, text-to-image, personalized AI personas and AI channel configuration. Every user keeps a personal conversation history, and channels can opt into shared history."
        },
        blocks: [
            {
                h: { vi: "AI Chat", en: "AI Chat" },
                p: { vi: "Chat AI trực tiếp trong Discord với `!chat <message>` hoặc `/chat`. Mỗi người dùng có **lịch sử hội thoại riêng**, và `!clearchat` / `/clearchat` giúp bạn bắt đầu lại bất cứ lúc nào.", en: "Chat with AI directly in Discord via `!chat <message>` or `/chat`. Each user has their **own conversation history**, and `!clearchat` / `/clearchat` lets you start fresh anytime." }
            },
            {
                h: { vi: "AI Image", en: "AI Image" },
                p: { vi: "Tạo ảnh AI từ câu lệnh văn bản bằng `!image <prompt>` hoặc `/image`. **Cocolink** là nhà cung cấp chính, **Gemini** được dùng làm dự phòng khi cần thiết.", en: "Generate AI images from text prompts with `!image <prompt>` or `/image`. **Cocolink** is the primary provider; **Gemini** is used as a fallback when necessary." }
            },
            {
                h: { vi: "AI Persona", en: "AI Persona" },
                p: { vi: "Đổi tính cách AI bằng `!persona <code>` hoặc tạo persona tùy ý với `!persona custom: <description>`. Xem persona hiện tại bằng `!mypersona` và đặt lại bằng `!resetpersona`.", en: "Switch the AI's personality with `!persona <code>`, or craft your own with `!persona custom: <description>`. View the current persona via `!mypersona` and reset it with `!resetpersona`." }
            },
            {
                h: { vi: "AI Channel & Shared History", en: "AI Channel & Shared History" },
                p: { vi: "`!setai` / `/setai` biến kênh hiện tại thành **kênh AI** — người dùng nhắn tin là Nova trả lời, không cần gõ `!chat`. `!setsharedhistory` / `/setsharedhistory` cho phép kênh dùng **lịch sử hội thoại chung**; tắt bằng `!unsetai` và `!unsetsharedhistory`.", en: "`!setai` / `/setai` turns the current channel into an **AI channel** — users simply talk and Nova answers, no `!chat` needed. `!setsharedhistory` / `/setsharedhistory` enables a **shared conversation history** for the channel; disable with `!unsetai` and `!unsetsharedhistory`." }
            },
            {
                h: { vi: "Ngôn ngữ phản hồi", en: "Response language" },
                p: { vi: "`!language <vi|en>` hoặc `/language` đặt ngôn ngữ Nova trả lời bạn — tiếng Việt hoặc tiếng Anh.", en: "`!language <vi|en>` or `/language` sets the language Nova replies in — Vietnamese or English." }
            }
        ],
        notes: {
            vi: "Nhà cung cấp ảnh: **Cocolink** (chính) · **Gemini** (dự phòng). Mô hình AI công khai hiển thị trên website: **Qwen3.7-max**. Nova không bao giờ công bố API key hay thông tin đăng nhập.",
            en: "Image providers: **Cocolink** (primary) · **Gemini** (fallback). Public AI model displayed on this website: **Qwen3.7-max**. Nova never exposes API keys or credentials."
        },
        perms: {
            vi: "Mọi người đều có thể chat và tạo ảnh. `!setai`, `!setsharedhistory` cần quyền quản lý kênh (Manage Channels hoặc cấp quản lý).",
            en: "Everyone can chat and generate images. `!setai` and `!setsharedhistory` require channel management (Manage Channels or manager level)."
        },
        examples: [
            { c: "!chat gợi ý tên server hay", d: { vi: "Nova trả lời kèm lịch sử riêng của bạn", en: "Nova replies using your personal history" } },
            { c: "/image một thành phố neon dưới mưa", d: { vi: "Tạo ảnh qua Cocolink (Gemini dự phòng)", en: "Image via Cocolink (Gemini fallback)" } },
            { c: "!persona custom: thuyền trưởng vui tính", d: { vi: "Đặt persona tùy chỉnh", en: "Set a custom persona" } },
            { c: "!setai", d: { vi: "Biến kênh hiện tại thành kênh AI", en: "Turn current channel into an AI channel" } }
        ]
    },
    {
        id: "war", size: 3,
        title: { vi: "⚔️ War Ping / Backup Ping", en: "⚔️ War Ping / Backup Ping" },
        tag: { vi: "Điều phối War & Backup", en: "War & Backup coordination" },
        desc: { vi: "Tạo yêu cầu War Ping / Backup Ping, thu thập thông tin và tự động mở thread điều phối.", en: "Create War Ping / Backup Ping requests, collect the details and auto-open a coordination thread." },
        intro: {
            vi: "Hệ thống điều phối cộng đồng của Nova: gọi người vào War hoặc gọi Backup, theo dõi thắng/thua và kết thúc phiên — tất cả qua nút bấm và thread Discord.",
            en: "Nova's community coordination system: call people into a War or request Backup, track win/lose outcomes and end sessions — all through Discord buttons and threads."
        },
        blocks: [
            {
                h: { vi: "War Ping", en: "War Ping" },
                p: { vi: "Tạo yêu cầu War Ping: Nova thu thập **enemy/clan**, **khu vực (region)**, **link/code Roblox server**, rồi tạo **thread điều phối** và ping War Ping Role.", en: "Create a War Ping request: Nova collects the **enemy/clan**, **region** and **Roblox server link/code**, then creates a **coordination thread** and pings the War Ping Role." }
            },
            {
                h: { vi: "Backup Ping", en: "Backup Ping" },
                p: { vi: "Tạo yêu cầu Backup Ping với các thông tin cần thiết, tạo thread điều phối riêng và ping Backup Ping Role.", en: "Create a Backup Ping request with the required information, open its own coordination thread and ping the Backup Ping Role." }
            },
            {
                h: { vi: "Nút điều khiển", en: "Control buttons" },
                p: { vi: "Các nút **WAR**, **BACKUP**, **WIN**, **LOSE**, **END** điều khiển phiên trực tiếp. Nova có quyền cấu hình riêng để quyết định **thành viên thường có được bấm nút kết quả War/Backup hay không**.", en: "The **WAR**, **BACKUP**, **WIN**, **LOSE**, **END** buttons drive the session live. Nova has a dedicated configurable permission for **whether regular members may press the War/Backup result buttons**." }
            },
            {
                h: { vi: "Kết thúc toàn bộ & Call Hacker", en: "Global ending & Call Hacker" },
                p: { vi: "`/end all` kết thúc **mọi phiên War/Backup đang hoạt động** trong server hiện tại. `/callhacker show` / `/callhacker hide` ẩn hiện nút gọi Hacker — chỉnh bằng quyền cấp quản lý.", en: "`/end all` ends **every active War/Backup session** in the current server. `/callhacker show` / `/callhacker hide` toggles the Call Hacker button — configurable with manager-level permissions." }
            },
            {
                h: { vi: "Role cấu hình & người được tin cậy", en: "Configurable roles & trusted users" },
                p: { vi: "5 role tùy chỉnh: **War Ping Role**, **Backup Ping Role**, **Joined War Role**, **Joined Backup Role**, **Hacker Role**. `/trust add · remove · list` quản lý danh sách người được tin cậy — họ có thể nhận quyền quản lý War theo hệ thống phân quyền của bot.", en: "Five configurable roles: **War Ping Role**, **Backup Ping Role**, **Joined War Role**, **Joined Backup Role**, **Hacker Role**. `/trust add · remove · list` manages trusted users — they can receive War management access according to the bot's permission system." }
            }
        ],
        perms: {
            vi: "Tạo War/Backup: thành viên (tùy cấu hình). Nút WIN/LOSE: theo quyền được cấu hình. END, /end all, /trust, /callhacker, /helppanel: quản lý hoặc người được tin cậy.",
            en: "Creating War/Backup: members (configurable). WIN/LOSE buttons: per configured permission. END, /end all, /trust, /callhacker, /helppanel: managers or trusted users."
        },
        examples: [
            { c: "Nút WAR → điền enemy, region, link Roblox", d: { vi: "Nova mở thread điều phối + ping role", en: "Nova opens a coordination thread + pings the role" } },
            { c: "/end all", d: { vi: "Đóng mọi phiên War/Backup trong server", en: "Close every War/Backup session in the server" } },
            { c: "/trust add @user", d: { vi: "Trao quyền quản lý War cho thành viên", en: "Grant War management access to a member" } }
        ]
    },
    {
        id: "banzone", size: 2,
        title: { vi: "☠️ Ban Zone", en: "☠️ Ban Zone" },
        tag: { vi: "Bảo vệ server", en: "Server protection" },
        desc: { vi: "Kênh bảo vệ tự động: người vi phạm bị xử lý theo chế độ, whitelist miễn trừ, cách ly từng server.", en: "Automatic protection channel: offenders are processed by mode, whitelist exempt, isolated per server." },
        intro: {
            vi: "Ban Zone là hệ thống bảo vệ server: chỉ định một kênh làm Ban Zone, Nova sẽ xử lý người vi phạm trong kênh đó theo chế độ đã cấu hình — ban hoặc mute — với whitelist miễn trừ.",
            en: "Ban Zone is a server protection system: designate a channel as the Ban Zone and Nova processes offenders there according to the configured mode — ban or mute — with an exempt whitelist."
        },
        blocks: [
            {
                h: { vi: "Thiết lập & chế độ", en: "Setup & modes" },
                p: { vi: "`/setbanchannel true|false` bật/tắt và chỉ định kênh Ban Zone. `/banzone mode:ban` đặt **Ban Mode**, `/banzone mode:mute duration:10m` đặt **Mute Mode** với thời gian cụ thể.", en: "`/setbanchannel true|false` enables/disables and sets the Ban Zone channel. `/banzone mode:ban` sets **Ban Mode**, `/banzone mode:mute duration:10m` sets **Mute Mode** with a specific duration." }
            },
            {
                h: { vi: "Whitelist & kiểm tra", en: "Whitelist & debugging" },
                p: { vi: "`/banwhitelist add|remove|list @user` quản lý danh sách miễn trừ. Whitelist **tách biệt theo từng server** — whitelist ở Server A không ảnh hưởng Server B. **Chỉ Server Owner** mới quản lý được whitelist; Administrator hay Manage Server alone là chưa đủ. `/bandebug @user` kiểm tra thử bot có thể xử lý thành viên đó không.", en: "`/banwhitelist add|remove|list @user` manages the exempt list. The whitelist is **isolated per server** — a whitelist in Server A never affects Server B. **Only the Server Owner** can manage it; Administrator or Manage Server alone is not enough. `/bandebug @user` dry-tests whether the bot can act on a member." }
            },
            {
                h: { vi: "Hành vi bảo vệ", en: "Protection behavior" },
                p: { vi: "Nova tuân theo **role hierarchy**: không thể ban Server Owner; quyền của mục tiêu không vượt qua được cấp role. Tin nhắn gần đây của người vi phạm có thể được dọn theo hành vi của bot. Cấu hình kênh **cách ly hoàn toàn theo từng server**.", en: "Nova follows **role hierarchy**: the Server Owner can never be banned by the bot; a target's permissions do not override role hierarchy. Recent offender messages may be cleaned according to bot behavior. Channel configuration is **fully isolated per server**." }
            },
            {
                h: { vi: "Bảo vệ kênh khỏi bị xóa", en: "Channel deletion protection" },
                p: { vi: "Nếu kênh Ban Zone bị xóa, Nova cố gắng xác định người thực hiện qua **audit log** của Discord khi có thể và xử lý theo logic bảo vệ. Nova **không bao giờ ban người đã mời bot** chỉ vì một kênh bị xóa.", en: "If the configured Ban Zone channel is deleted, Nova detects the executor through Discord **audit logs** when possible and handles them according to its protection logic. Nova **never bans the person who invited the bot** merely because a channel was deleted." }
            }
        ],
        perms: {
            vi: "Server Owner: whitelist + cấu hình kênh/chế độ. Quản lý: /bandebug. Bot cần quyền Ban Members / Moderate Members và role đủ cao.",
            en: "Server Owner: whitelist + channel/mode configuration. Managers: /bandebug. The bot needs Ban Members / Moderate Members and a high enough role."
        },
        examples: [
            { c: "/setbanchannel true", d: { vi: "Chỉ định kênh hiện tại làm Ban Zone", en: "Set the current channel as the Ban Zone" } },
            { c: "/banzone mode:mute duration:10m", d: { vi: "Chuyển sang Mute Mode 10 phút", en: "Switch to 10-minute Mute Mode" } },
            { c: "/banwhitelist add @user", d: { vi: "Chỉ Server Owner thực hiện được", en: "Server Owner only" } }
        ]
    },
    {
        id: "mod", size: 2,
        title: { vi: "🛡️ Moderation", en: "🛡️ Moderation" },
        tag: { vi: "Ban · Mute chuẩn Discord", en: "Ban · Mute the Discord way" },
        desc: { vi: "Ban, unban, mute và unmute với phân quyền rõ ràng và giới hạn đúng chuẩn Discord.", en: "Ban, unban, mute and unmute with clear permissions and Discord-standard limits." },
        intro: {
            vi: "Bộ lệnh kiểm duyệt gọn và chuẩn xác: mỗi lệnh nêu rõ quyền yêu cầu và tuân theo role hierarchy của server.",
            en: "A tight, precise moderation set: every command states its required permission and follows the server's role hierarchy."
        },
        blocks: [
            {
                h: { vi: "Ban & Unban", en: "Ban & Unban" },
                p: { vi: "`/ban` ban thành viên được chọn — cần quyền **Ban Members** và role của bot phải nằm trên mục tiêu. `/unban` bỏ ban chính xác bằng **User ID**.", en: "`/ban` bans the selected member — requires **Ban Members** and the bot's role must sit above the target. `/unban` unbans precisely by **User ID**." }
            },
            {
                h: { vi: "Mute & Unmute", en: "Mute & Unmute" },
                p: { vi: "`/mute` timeout thành viên — **bắt buộc nhập thời gian**, tối đa **28 ngày** theo giới hạn của Discord (ví dụ `10m`, `2h`, `7d`). Cần quyền **Moderate Members**. `/unmute` gỡ timeout ngay lập tức.", en: "`/mute` times out a member — a **duration is required**, up to **28 days** per Discord's limit (e.g. `10m`, `2h`, `7d`). Requires **Moderate Members**. `/unmute` lifts the timeout instantly." }
            }
        ],
        perms: {
            vi: "/ban · /unban → Ban Members. /mute · /unmute → Moderate Members. Role của bot phải cao hơn mục tiêu.",
            en: "/ban · /unban → Ban Members. /mute · /unmute → Moderate Members. The bot's role must be above the target."
        },
        examples: [
            { c: "/ban @user reason: spam", d: { vi: "Ban kèm lý do", en: "Ban with a reason" } },
            { c: "/unban 1532745879944036523", d: { vi: "Bỏ ban bằng User ID", en: "Unban by User ID" } },
            { c: "/mute @user duration:7d", d: { vi: "Timeout 7 ngày (tối đa 28d)", en: "7-day timeout (max 28d)" } }
        ]
    },
    {
        id: "event", size: 2,
        title: { vi: "🏆 Tạo event", en: "🏆 Create events" },
        tag: { vi: "Event cộng đồng", en: "Community events" },
        desc: { vi: "Tạo event, gửi thông báo, theo dõi người tham gia và quản lý blacklist sự kiện.", en: "Create events, send announcements, track participants and manage the event blacklist." },
        intro: {
            vi: "Hệ thống event đầy đủ của Nova: tạo và gửi event, kiểm tra hệ thống, đếm và quản lý người tham gia, kèm blacklist riêng cho sự kiện.",
            en: "Nova's complete event system: create and send events, test the system, count and manage participants, plus a dedicated event blacklist."
        },
        blocks: [
            {
                h: { vi: "Tạo & gửi event", en: "Create & send" },
                p: { vi: "`/event send` tạo và gửi event tới cộng đồng. `/event test` kiểm tra hệ thống event hoạt động đúng trước khi chạy thật.", en: "`/event send` creates and sends the event to your community. `/event test` verifies the event system works before going live." }
            },
            {
                h: { vi: "Người tham gia", en: "Participants" },
                p: { vi: "`/event participants` xem danh sách, `/event count` đếm số người, `/event remove` xóa một người tham gia và `/event clear` dọn dữ liệu event khi phù hợp.", en: "`/event participants` lists attendees, `/event count` counts them, `/event remove` removes a participant and `/event clear` clears event data when applicable." }
            },
            {
                h: { vi: "Blacklist event", en: "Event blacklist" },
                p: { vi: "`/event blacklist add`, `/event blacklist remove`, `/event blacklist list` quản lý danh sách bị cấm tham gia sự kiện của server.", en: "`/event blacklist add`, `/event blacklist remove` and `/event blacklist list` manage who is barred from joining the server's events." }
            }
        ],
        perms: {
            vi: "Quản lý event (send, test, remove, clear, blacklist) cần quyền cấp quản lý. Xem participants/count mở cho thành viên.",
            en: "Event management (send, test, remove, clear, blacklist) requires manager-level permissions. Viewing participants/count is open to members."
        },
        examples: [
            { c: "/event send", d: { vi: "Tạo & gửi event mới", en: "Create & send a new event" } },
            { c: "/event count", d: { vi: "Đếm người tham gia", en: "Count participants" } },
            { c: "/event blacklist add @user", d: { vi: "Cấm tham gia event", en: "Bar from events" } }
        ]
    },
    {
        id: "info", size: 2,
        title: { vi: "📊 Thông tin server", en: "📊 Server Information" },
        tag: { vi: "Info bot · server · user", en: "Bot · server · user info" },
        desc: { vi: "Bảng thông tin bot cực đầy đủ với /info và !info, kèm /serverinfo và /userinfo.", en: "A deeply detailed bot info panel via /info and !info, plus /serverinfo and /userinfo." },
        intro: {
            vi: "Muốn biết bot đang khỏe không, server có gì, ai đó là ai? Nova trả lời bằng những bảng thông tin chi tiết hiếm thấy ở bot Discord.",
            en: "Wondering how the bot is doing, what a server contains, or who someone is? Nova answers with unusually detailed info panels."
        },
        blocks: [
            {
                h: { vi: "/info và !info", en: "/info and !info" },
                p: { vi: "`/info` và **`!info` — phiên bản prefix của `/info`** — mở bảng thông tin bot: tên & ID bot, owner, ngày tạo, độ trễ, uptime, phiên bản Python & discord.py, tổng số server/user/kênh, trạng thái AI & model, phiên War/Backup đang chạy, danh sách trusted, kênh Ban Zone, số whitelist, kênh Help, chế độ Ban Zone, số lệnh slash/prefix, kèm chi tiết server hiện tại (owner, thành viên, role hierarchy, quyền của bot).", en: "`/info` and **`!info` — the prefix version of `/info`** — open the bot information panel: bot name & ID, owner, creation time, latency, uptime, Python & discord.py versions, total servers/users/channels, AI status & model, active War/Backup sessions, trusted users, Ban Zone channel, whitelist count, Help channel, Ban Zone mode, slash/prefix command counts, plus current-server details (owner, members, bot role hierarchy, bot permissions)." }
            },
            {
                h: { vi: "/serverinfo", en: "/serverinfo" },
                p: { vi: "`/serverinfo` hiển thị tên & ID server, owner, số thành viên, kênh, role, boost, mức verification, tính năng (features), icon & banner của server.", en: "`/serverinfo` shows the server name & ID, owner, member counts, channels, roles, boosts, verification level, features, and the server icon/banner." }
            },
            {
                h: { vi: "/userinfo", en: "/userinfo" },
                p: { vi: "`/userinfo` hiển thị thông tin người dùng: ngày tạo tài khoản, ngày vào server, role, trạng thái, nền tảng, hoạt động, biệt danh, trạng thái boost và timeout.", en: "`/userinfo` shows user information: account creation, server join date, roles, status, platform, activity, nickname, boost and timeout status." }
            }
        ],
        notes: {
            vi: "Chỉ `!info` là lệnh prefix thông tin mới được thêm. `/serverinfo` và `/userinfo` chỉ có dạng slash.",
            en: "Only `!info` is a newly added prefix info command. `/serverinfo` and `/userinfo` exist as slash commands only."
        },
        perms: { vi: "Mọi thành viên đều dùng được cả bốn lệnh.", en: "All four commands are open to every member." },
        examples: [
            { c: "!info", d: { vi: "Bảng thông tin bot (prefix)", en: "Bot info panel (prefix)" } },
            { c: "/info", d: { vi: "Bảng thông tin bot (slash)", en: "Bot info panel (slash)" } },
            { c: "/serverinfo", d: { vi: "Toàn cảnh server", en: "Full server overview" } },
            { c: "/userinfo @user", d: { vi: "Hồ sơ thành viên", en: "Member profile" } }
        ]
    },
    {
        id: "config", size: 2,
        title: { vi: "⚙️ Cấu hình", en: "⚙️ Configuration" },
        tag: { vi: "Thiết lập role & kênh", en: "Role & channel setup" },
        desc: { vi: "Cấu hình server tập trung cho War/Backup, Help và các hệ thống khác của Nova.", en: "Central server configuration for War/Backup, Help and Nova's other systems." },
        intro: {
            vi: "Mọi thiết lập của Nova nằm trong một nhóm lệnh /config duy nhất — xem toàn bộ hoặc chỉnh từng mục.",
            en: "All of Nova's settings live in a single /config command group — view everything or tweak items one by one."
        },
        blocks: [
            {
                h: { vi: "Xem cấu hình", en: "View configuration" },
                p: { vi: "`/config view` hiển thị toàn bộ thiết lập hiện tại của server trong một bảng gọn gàng.", en: "`/config view` displays the server's entire current configuration in one tidy panel." }
            },
            {
                h: { vi: "Kênh & role", en: "Channel & roles" },
                p: { vi: "`/config help_channel` đặt kênh trợ giúp; `/config war_ping_role`, `/config backup_ping_role`, `/config joined_war_role`, `/config joined_backup_role`, `/config hacker_role` gắn các role được War/Backup và hệ thống Help sử dụng.", en: "`/config help_channel` sets the help channel; `/config war_ping_role`, `/config backup_ping_role`, `/config joined_war_role`, `/config joined_backup_role` and `/config hacker_role` attach the roles used by War/Backup and the Help systems." }
            }
        ],
        perms: {
            vi: "Cần quyền cấp quản lý (Manage Server hoặc cao hơn). Thiết lập áp dụng riêng cho từng server.",
            en: "Requires manager permissions (Manage Server or higher). Settings apply per server."
        },
        examples: [
            { c: "/config view", d: { vi: "Xem mọi thiết lập", en: "See every setting" } },
            { c: "/config war_ping_role @WarTeam", d: { vi: "Gắn role ping War", en: "Attach the War ping role" } },
            { c: "/config help_channel #help", d: { vi: "Đặt kênh trợ giúp", en: "Set the help channel" } }
        ]
    },
    {
        id: "helpsys", size: 2,
        title: { vi: "📖 Hệ thống trợ giúp", en: "📖 Help System" },
        tag: { vi: "!help · menu category", en: "!help · category menu" },
        desc: { vi: "Menu trợ giúp dạng dropdown trong Discord, và !help <feature> cho trợ giúp đúng một tính năng.", en: "A dropdown help menu inside Discord, and !help <feature> for single-feature help." },
        intro: {
            vi: "Hai kiểu trợ giúp: menu category tương tác khi gõ !help, và trợ giúp chi tiết của đúng một tính năng khi gõ !help <feature>.",
            en: "Two help styles: an interactive category menu on !help, and detailed help for exactly one feature on !help <feature>."
        },
        blocks: [
            {
                h: { vi: "Menu chính", en: "Main menu" },
                p: { vi: "`!help` hoặc `/help` mở **Categories Help Menu** với dropdown: AI Chatbot, War Ping / Backup Ping, Event, Ban Channel và Admin. Chọn category nào, Nova chỉ hiện đúng category đó.", en: "`!help` or `/help` opens the **Categories Help Menu** with a dropdown: AI Chatbot, War Ping / Backup Ping, Event, Ban Channel and Admin. Whichever category you pick, Nova shows exactly that category." }
            },
            {
                h: { vi: "Trợ giúp theo tính năng", en: "Feature-specific help" },
                p: { vi: "`!help <feature>` hiển thị **chỉ** trợ giúp chi tiết của tính năng được hỏi — không xổ ra cả category. Ví dụ: `!help chat`, `!help info`, `!help ban`, `!help mute`, `!help warping`.", en: "`!help <feature>` shows **only** the detailed help for that specific command/feature — never the whole category. Examples: `!help chat`, `!help info`, `!help ban`, `!help mute`, `!help warping`." }
            }
        ],
        perms: { vi: "Mọi thành viên đều dùng được. Lệnh trong category Admin chỉ hiển thị cho bot owner.", en: "Open to all members. Commands inside the Admin category are only shown to the bot owner." },
        examples: [
            { c: "!help", d: { vi: "Mở Categories Help Menu", en: "Open the Categories Help Menu" } },
            { c: "!help warping", d: { vi: "Chỉ hiện chi tiết War Ping", en: "Only War Ping details" } },
            { c: "!help ban", d: { vi: "Chỉ hiện chi tiết lệnh ban", en: "Only the ban command details" } }
        ]
    }
];

/* ---------------- command directory ---------------- */
/* perms: 0 = everyone, 1 = manager-level, 2 = specific Discord perm, 3 = server owner, 4 = bot owner */
const COMMANDS = [
    /* ---- AI ---- */
    { cat: "ai", cmd: "!chat <message>", type: "prefix", perm: 0, vi: "Chat với AI, lưu lịch sử hội thoại riêng của bạn.", en: "Chat with the AI, keeping your personal conversation history.", ex: "!chat giới thiệu game hay" },
    { cat: "ai", cmd: "/chat", type: "slash", perm: 0, vi: "Chat với AI (phiên bản slash), kèm lịch sử riêng.", en: "Chat with the AI (slash version), with personal history." },
    { cat: "ai", cmd: "!image <prompt>", type: "prefix", perm: 0, vi: "Tạo ảnh AI từ mô tả — Cocolink chính, Gemini dự phòng.", en: "Generate an AI image from a prompt — Cocolink primary, Gemini fallback.", ex: "!image mèo phi hành gia" },
    { cat: "ai", cmd: "/image", type: "slash", perm: 0, vi: "Tạo ảnh AI (phiên bản slash).", en: "Generate an AI image (slash version)." },
    { cat: "ai", cmd: "!clearchat", type: "prefix", perm: 0, vi: "Xóa lịch sử hội thoại AI của chính bạn.", en: "Clear your own AI conversation history." },
    { cat: "ai", cmd: "/clearchat", type: "slash", perm: 0, vi: "Xóa lịch sử AI của bạn (phiên bản slash).", en: "Clear your AI history (slash version)." },
    { cat: "ai", cmd: "!setai", type: "prefix", perm: 1, vi: "Biến kênh hiện tại thành kênh AI — không cần gõ !chat.", en: "Turn the current channel into an AI channel — no !chat needed." },
    { cat: "ai", cmd: "/setai", type: "slash", perm: 1, vi: "Bật kênh AI (phiên bản slash).", en: "Enable an AI channel (slash version)." },
    { cat: "ai", cmd: "!unsetai", type: "prefix", perm: 1, vi: "Tắt chế độ kênh AI ở kênh hiện tại.", en: "Disable AI channel mode in the current channel." },
    { cat: "ai", cmd: "!setsharedhistory", type: "prefix", perm: 1, vi: "Bật lịch sử AI dùng chung cho cả kênh.", en: "Enable shared AI conversation history for the channel." },
    { cat: "ai", cmd: "/setsharedhistory", type: "slash", perm: 1, vi: "Bật lịch sử dùng chung (phiên bản slash).", en: "Enable shared history (slash version)." },
    { cat: "ai", cmd: "!unsetsharedhistory", type: "prefix", perm: 1, vi: "Tắt lịch sử dùng chung, quay về lịch sử cá nhân.", en: "Disable shared history, back to personal history." },
    { cat: "ai", cmd: "!persona <code>", type: "prefix", perm: 0, vi: "Đặt tính cách AI theo mã có sẵn.", en: "Set the AI personality with a preset code.", ex: "!persona dark" },
    { cat: "ai", cmd: "!persona custom: <description>", type: "prefix", perm: 0, vi: "Tạo persona AI tùy chỉnh theo mô tả của bạn.", en: "Create a custom AI persona from your description.", ex: "!persona custom: phù thủy hài hước" },
    { cat: "ai", cmd: "/persona", type: "slash", perm: 0, vi: "Đặt persona AI (phiên bản slash).", en: "Set an AI persona (slash version)." },
    { cat: "ai", cmd: "!mypersona", type: "prefix", perm: 0, vi: "Xem persona AI hiện tại của bạn.", en: "View your current AI persona." },
    { cat: "ai", cmd: "/mypersona", type: "slash", perm: 0, vi: "Xem persona hiện tại (phiên bản slash).", en: "View your current persona (slash version)." },
    { cat: "ai", cmd: "!resetpersona", type: "prefix", perm: 0, vi: "Xóa persona, trở về mặc định.", en: "Reset your persona to default." },
    { cat: "ai", cmd: "/resetpersona", type: "slash", perm: 0, vi: "Xóa persona (phiên bản slash).", en: "Reset your persona (slash version)." },
    { cat: "ai", cmd: "!language <vi|en>", type: "prefix", perm: 0, vi: "Đặt ngôn ngữ Nova trả lời bạn: Việt hoặc Anh.", en: "Set the language Nova replies in: Vietnamese or English.", ex: "!language vi" },
    { cat: "ai", cmd: "/language", type: "slash", perm: 0, vi: "Đặt ngôn ngữ (phiên bản slash).", en: "Set the language (slash version)." },

    /* ---- Moderation ---- */
    { cat: "mod", cmd: "/ban @user [reason]", type: "slash", perm: 2, permNote: { vi: "Ban Members + role hierarchy", en: "Ban Members + role hierarchy" }, vi: "Ban thành viên được chọn; role của bot phải nằm trên mục tiêu.", en: "Ban the selected member; the bot's role must sit above the target.", ex: "/ban @user reason: spam" },
    { cat: "mod", cmd: "/unban <user_id>", type: "slash", perm: 2, permNote: { vi: "Ban Members", en: "Ban Members" }, vi: "Bỏ ban chính xác bằng User ID.", en: "Unban precisely by User ID.", ex: "/unban 1532745879944036523" },
    { cat: "mod", cmd: "/mute @user duration:<time>", type: "slash", perm: 2, permNote: { vi: "Moderate Members · tối đa 28 ngày", en: "Moderate Members · max 28 days" }, vi: "Timeout thành viên; thời gian bắt buộc (10m, 2h, 7d…), tối đa 28 ngày.", en: "Time out a member; duration required (10m, 2h, 7d…), up to 28 days.", ex: "/mute @user duration:2h" },
    { cat: "mod", cmd: "/unmute @user", type: "slash", perm: 2, permNote: { vi: "Moderate Members", en: "Moderate Members" }, vi: "Gỡ timeout khỏi thành viên ngay lập tức.", en: "Remove the timeout from a member instantly." },

    /* ---- Ban Zone ---- */
    { cat: "banzone", cmd: "/banzone mode:ban", type: "slash", perm: 3, vi: "Đặt Ban Mode: người vi phạm trong Ban Zone sẽ bị ban.", en: "Set Ban Mode: offenders in the Ban Zone get banned." },
    { cat: "banzone", cmd: "/banzone mode:mute duration:10m", type: "slash", perm: 3, vi: "Đặt Mute Mode với thời gian cụ thể.", en: "Set Mute Mode with a specific duration.", ex: "/banzone mode:mute duration:1h" },
    { cat: "banzone", cmd: "/setbanchannel true|false", type: "slash", perm: 3, vi: "Chỉ định kênh hiện tại làm Ban Zone, hoặc tắt Ban Zone.", en: "Configure the current channel as the Ban Zone channel, or disable it.", ex: "/setbanchannel true" },
    { cat: "banzone", cmd: "/banwhitelist add|remove|list", type: "slash", perm: 3, vi: "Quản lý whitelist miễn trừ — chỉ Server Owner, tách biệt từng server.", en: "Manage the exempt whitelist — Server Owner only, isolated per server.", ex: "/banwhitelist add @user" },
    { cat: "banzone", cmd: "/bandebug @user", type: "slash", perm: 1, vi: "Kiểm tra thử bot có thể xử lý thành viên được chọn không.", en: "Dry-test whether the bot can act on the selected member." },

    /* ---- War / Backup ---- */
    { cat: "war", cmd: "WAR", type: "button", perm: 0, vi: "Nút tạo yêu cầu War Ping: enemy/clan, region, link Roblox → mở thread.", en: "Button to create a War Ping request: enemy/clan, region, Roblox link → opens a thread." },
    { cat: "war", cmd: "BACKUP", type: "button", perm: 0, vi: "Nút tạo yêu cầu Backup Ping và mở thread điều phối.", en: "Button to create a Backup Ping request and open a coordination thread." },
    { cat: "war", cmd: "WIN", type: "button", perm: 1, vi: "Ghi nhận kết quả thắng — quyền bấm được cấu hình riêng.", en: "Record a win — press permission is separately configurable." },
    { cat: "war", cmd: "LOSE", type: "button", perm: 1, vi: "Ghi nhận kết quả thua — quyền bấm được cấu hình riêng.", en: "Record a loss — press permission is separately configurable." },
    { cat: "war", cmd: "END", type: "button", perm: 1, vi: "Kết thúc phiên War/Backup đang diễn ra.", en: "End the running War/Backup session." },
    { cat: "war", cmd: "/end all", type: "slash", perm: 1, vi: "Kết thúc tất cả phiên War/Backup đang hoạt động trong server.", en: "End all active War/Backup sessions in the current server." },
    { cat: "war", cmd: "/trust add|remove|list", type: "slash", perm: 1, vi: "Quản lý người được tin cậy — có thể nhận quyền quản lý War.", en: "Manage trusted users — they can receive War management access.", ex: "/trust add @user" },
    { cat: "war", cmd: "/helppanel", type: "slash", perm: 1, vi: "Gửi bảng trợ giúp War/Backup vào kênh được cấu hình.", en: "Send the War/Backup help panel to the configured channel." },
    { cat: "war", cmd: "/callhacker show|hide", type: "slash", perm: 1, vi: "Ẩn/hiện nút Call Hacker — quyền cấp quản lý.", en: "Show or hide the Call Hacker button — manager-level permission.", ex: "/callhacker show" },

    /* ---- Events ---- */
    { cat: "event", cmd: "/event send", type: "slash", perm: 1, vi: "Tạo và gửi event tới cộng đồng.", en: "Create and send an event to the community." },
    { cat: "event", cmd: "/event test", type: "slash", perm: 1, vi: "Chạy thử để kiểm tra hệ thống event.", en: "Test-run the event system." },
    { cat: "event", cmd: "/event participants", type: "slash", perm: 0, vi: "Xem danh sách người tham gia event.", en: "View the event participants list." },
    { cat: "event", cmd: "/event count", type: "slash", perm: 0, vi: "Đếm số người tham gia event.", en: "Count event participants." },
    { cat: "event", cmd: "/event remove @user", type: "slash", perm: 1, vi: "Xóa một người khỏi danh sách tham gia.", en: "Remove a participant from the event." },
    { cat: "event", cmd: "/event clear", type: "slash", perm: 1, vi: "Dọn dữ liệu/người tham gia event khi phù hợp.", en: "Clear event participants/data when applicable." },
    { cat: "event", cmd: "/event blacklist add", type: "slash", perm: 1, vi: "Thêm người vào blacklist event.", en: "Add a user to the event blacklist." },
    { cat: "event", cmd: "/event blacklist remove", type: "slash", perm: 1, vi: "Xóa người khỏi blacklist event.", en: "Remove a user from the event blacklist." },
    { cat: "event", cmd: "/event blacklist list", type: "slash", perm: 1, vi: "Xem danh sách blacklist event.", en: "List the event blacklist." },

    /* ---- Server Information ---- */
    { cat: "info", cmd: "/info", type: "slash", perm: 0, vi: "Bảng thông tin bot: uptime, latency, AI, War/Backup, Ban Zone, server hiện tại…", en: "Bot info panel: uptime, latency, AI, War/Backup, Ban Zone, current-server details…" },
    { cat: "info", cmd: "!info", type: "prefix", perm: 0, isNew: true, vi: "Phiên bản prefix mới của /info — cùng một bảng thông tin bot đầy đủ.", en: "The newly added prefix version of /info — the same full bot info panel." },
    { cat: "info", cmd: "/serverinfo", type: "slash", perm: 0, vi: "Tên & ID server, owner, thành viên, kênh, role, boost, verification, icon/banner.", en: "Server name & ID, owner, members, channels, roles, boosts, verification, icon/banner." },
    { cat: "info", cmd: "/userinfo @user", type: "slash", perm: 0, vi: "Ngày tạo tài khoản, ngày vào server, role, trạng thái, nền tảng, boost, timeout.", en: "Account creation, server join, roles, status, platform, boost, timeout status." },

    /* ---- Configuration ---- */
    { cat: "config", cmd: "/config view", type: "slash", perm: 1, vi: "Xem toàn bộ cấu hình hiện tại của server.", en: "View the server's entire current configuration." },
    { cat: "config", cmd: "/config help_channel", type: "slash", perm: 1, vi: "Đặt kênh trợ giúp cho hệ thống Help.", en: "Set the help channel for the Help system.", ex: "/config help_channel #help" },
    { cat: "config", cmd: "/config war_ping_role", type: "slash", perm: 1, vi: "Gắn role được ping khi tạo War.", en: "Attach the role pinged when a War starts." },
    { cat: "config", cmd: "/config backup_ping_role", type: "slash", perm: 1, vi: "Gắn role được ping khi gọi Backup.", en: "Attach the role pinged when Backup is called." },
    { cat: "config", cmd: "/config joined_war_role", type: "slash", perm: 1, vi: "Role cấp cho người tham gia War.", en: "Role granted to members who join a War." },
    { cat: "config", cmd: "/config joined_backup_role", type: "slash", perm: 1, vi: "Role cấp cho người tham gia Backup.", en: "Role granted to members who join a Backup." },
    { cat: "config", cmd: "/config hacker_role", type: "slash", perm: 1, vi: "Gắn Hacker Role dùng bởi Call Hacker.", en: "Attach the Hacker Role used by Call Hacker." },

    /* ---- Help ---- */
    { cat: "help", cmd: "!help", type: "prefix", perm: 0, vi: "Mở Categories Help Menu với dropdown tương tác.", en: "Open the Categories Help Menu with an interactive dropdown." },
    { cat: "help", cmd: "/help", type: "slash", perm: 0, vi: "Mở Categories Help Menu (phiên bản slash).", en: "Open the Categories Help Menu (slash version)." },
    { cat: "help", cmd: "!help <feature>", type: "prefix", perm: 0, vi: "Chỉ hiện trợ giúp chi tiết của đúng tính năng được hỏi.", en: "Show detailed help for that specific feature only.", ex: "!help warping" },

    /* ---- Admin (bot owner only) ---- */
    { cat: "admin", cmd: "!reg", type: "prefix", perm: 4, vi: "Đăng ký/đồng bộ quyền quản trị hệ thống (chỉ bot owner).", en: "Register/sync system administration (bot owner only)." },
    { cat: "admin", cmd: "!napkey", type: "prefix", perm: 4, vi: "Nạp Cocolink API key vào hệ thống.", en: "Load a Cocolink API key into the system." },
    { cat: "admin", cmd: "!addkey", type: "prefix", perm: 4, vi: "Thêm một API key mới.", en: "Add a new API key." },
    { cat: "admin", cmd: "!checkkey", type: "prefix", perm: 4, vi: "Kiểm tra trạng thái các key hiện có.", en: "Check the status of existing keys." },
    { cat: "admin", cmd: "!testkey", type: "prefix", perm: 4, vi: "Chạy thử một key để xác nhận hoạt động.", en: "Test-run a key to confirm it works." },
    { cat: "admin", cmd: "!delkey", type: "prefix", perm: 4, vi: "Xóa một key khỏi hệ thống.", en: "Delete a key from the system." },
    { cat: "admin", cmd: "!clearkey", type: "prefix", perm: 4, vi: "Xóa toàn bộ key đang nạp.", en: "Clear all loaded keys." },
    { cat: "admin", cmd: "!random", type: "prefix", perm: 4, vi: "Chọn ngẫu nhiên một key để sử dụng.", en: "Randomly pick a key to use." },
    { cat: "admin", cmd: "!changeapi", type: "prefix", perm: 4, vi: "Chuyển đổi nhà cung cấp API.", en: "Switch the active API provider." },
    { cat: "admin", cmd: "!sync", type: "prefix", perm: 4, vi: "Đồng bộ dữ liệu hệ thống.", en: "Synchronize system data." }
];

const PERM_LABELS = {
    0: { vi: "Mọi người", en: "Everyone" },
    1: { vi: "Quản lý / Trusted", en: "Manager / Trusted" },
    2: { vi: "Quyền Discord", en: "Discord permission" },
    3: { vi: "Server Owner", en: "Server Owner" },
    4: { vi: "Chỉ Bot Owner", en: "Bot Owner only" }
};

/* ---------------- help menu preview data ---------------- */
const HELP_MENU = {
    vi: {
        author: "Nova Help Menu",
        title: "📖 Help Menu",
        body: "Đây là menu trợ giúp của bot.\nDùng dropdown bên dưới để xem category bạn muốn.",
        catsTitle: "📋 Categories",
        tipTitle: "💡 Mẹo",
        tipBody: "Mới dùng? Hãy xem thử category AI Chatbot hoặc War Ping / Backup Ping bên dưới để bắt đầu.",
        footer: "Chọn một category bên dưới để xem chi tiết",
        placeholder: "Chọn một mục",
        detailPrefix: "Chi tiết"
    },
    en: {
        author: "Nova Help Menu",
        title: "📖 Help Menu",
        body: "This is the bot's help menu.\nUse the dropdown below to view the category you want.",
        catsTitle: "📋 Categories",
        tipTitle: "💡 Tip",
        tipBody: "New here? Check out the AI Chatbot or War Ping / Backup Ping category below to get started.",
        footer: "Pick a category below for details",
        placeholder: "Make a selection",
        detailPrefix: "Details"
    }
};

const HELP_CATS = [
    { id: "ai", dirCat: "ai", emoji: "🤖", name: "AI Chatbot", desc: { vi: "Chat với AI (Qwen) ngay trong kênh", en: "Chat with AI (Qwen) right in the channel" } },
    { id: "war", dirCat: "war", emoji: "⚔️", name: "War Ping / Backup Ping", desc: { vi: "Gọi người vào war hoặc gọi backup", en: "Call people into a war or call for backup" } },
    { id: "event", dirCat: "event", emoji: "🏆", name: "Event", desc: { vi: "Tạo event", en: "Create events" } },
    { id: "banzone", dirCat: "banzone", emoji: "☠️", name: "Ban Channel", desc: { vi: "Kênh tự động ban, người trong whitelist được miễn", en: "Auto-ban channel, whitelist users exempt from ban" } },
    { id: "admin", dirCat: "admin", emoji: "🔐", name: "Admin", desc: { vi: "Quản lý cocolink API key, khởi động lại bot (chỉ bot owner)", en: "Manage cocolink API keys, restart bot (bot owner only)" } }
];

/* !help <feature> knowledge base */
const HELP_FEATURES = {
    chat: {
        title: "🤖 !chat / /chat",
        vi: "`!chat <message>` hoặc `/chat` — Trò chuyện với AI ngay trong Discord. Mỗi người dùng có lịch sử hội thoại riêng; dùng `!clearchat` để bắt đầu lại.",
        en: "`!chat <message>` or `/chat` — Chat with AI directly inside Discord. Every user keeps a personal conversation history; use `!clearchat` to start over."
    },
    image: {
        title: "🎨 !image / /image",
        vi: "`!image <prompt>` hoặc `/image` — Tạo ảnh AI từ mô tả văn bản. Cocolink là nhà cung cấp chính, Gemini dự phòng khi cần.",
        en: "`!image <prompt>` or `/image` — Generate AI images from text prompts. Cocolink is the primary provider, Gemini is the fallback."
    },
    info: {
        title: "ℹ️ !info / /info",
        vi: "`!info` hoặc `/info` — Xem thông tin chung của bot, bao gồm uptime, độ trễ, AI, War/Backup, Ban Zone và chi tiết server hiện tại.",
        en: "`!info` or `/info` — View general bot information, including uptime, latency, AI, War/Backup, Ban Zone and current-server details."
    },
    serverinfo: {
        title: "🖥️ /serverinfo",
        vi: "`/serverinfo` — Xem thông tin server: tên, ID, owner, số thành viên, kênh, role, boost, verification, tính năng, icon/banner.",
        en: "`/serverinfo` — View server information: name, ID, owner, member counts, channels, roles, boosts, verification, features, icon/banner."
    },
    userinfo: {
        title: "👤 /userinfo",
        vi: "`/userinfo` — Xem thông tin người dùng: ngày tạo tài khoản, ngày vào server, role, trạng thái, nền tảng, hoạt động, biệt danh, boost, timeout.",
        en: "`/userinfo` — View user information: account creation, server join, roles, status, platform, activity, nickname, boost, timeout."
    },
    ban: {
        title: "🔨 /ban",
        vi: "`/ban` — Ban thành viên được chọn. Cần quyền **Ban Members** và role của bot phải cao hơn mục tiêu.",
        en: "`/ban` — Ban the selected member. Requires the **Ban Members** permission and the bot's role must be above the target."
    },
    unban: {
        title: "🔓 /unban",
        vi: "`/unban` — Bỏ ban một người dùng bằng **User ID** để xác định chính xác. Cần quyền **Ban Members**.",
        en: "`/unban` — Unban a user via **User ID** for precise identification. Requires **Ban Members**."
    },
    mute: {
        title: "🤐 /mute",
        vi: "`/mute` — Timeout thành viên. Thời gian là bắt buộc, tối đa **28 ngày** — ví dụ: `10m`, `2h`, `7d`. Cần quyền **Moderate Members**.",
        en: "`/mute` — Time out a member. Duration is required, up to **28 days** — examples: `10m`, `2h`, `7d`. Requires **Moderate Members**."
    },
    unmute: {
        title: "🔊 /unmute",
        vi: "`/unmute` — Gỡ timeout khỏi thành viên. Cần quyền **Moderate Members**.",
        en: "`/unmute` — Remove a timeout from a member. Requires **Moderate Members**."
    },
    warping: {
        title: "⚔️ War Ping",
        vi: "Nút **WAR** — Tạo yêu cầu War Ping: Nova thu thập enemy/clan, region, link/code Roblox server rồi mở thread điều phối và ping War Ping Role.",
        en: "The **WAR** button — Creates a War Ping request: Nova collects the enemy/clan, region and Roblox server link/code, then opens a coordination thread and pings the War Ping Role."
    },
    backup: {
        title: "🛟 Backup Ping",
        vi: "Nút **BACKUP** — Tạo yêu cầu Backup Ping: Nova thu thập thông tin cần thiết, mở thread điều phối và ping Backup Ping Role.",
        en: "The **BACKUP** button — Creates a Backup Ping request: Nova collects the required information, opens a coordination thread and pings the Backup Ping Role."
    },
    war: {
        title: "⚔️ War Ping / Backup Ping",
        vi: "Hệ thống điều phối War & Backup: nút **WAR**, **BACKUP**, **WIN**, **LOSE**, **END**; `/end all` kết thúc mọi phiên; `/trust` quản lý người được tin cậy; `/callhacker show|hide` ẩn hiện nút gọi Hacker.",
        en: "The War & Backup coordination system: **WAR**, **BACKUP**, **WIN**, **LOSE**, **END** buttons; `/end all` ends every session; `/trust` manages trusted users; `/callhacker show|hide` toggles the Call Hacker button."
    },
    event: {
        title: "🏆 /event",
        vi: "Tạo event: `/event send` gửi event, `/event test` kiểm tra hệ thống, `/event participants` và `/event count` theo dõi người tham gia, `/event remove`, `/event clear` quản lý dữ liệu, `/event blacklist add|remove|list` quản lý blacklist.",
        en: "Create events: `/event send` sends an event, `/event test` tests the system, `/event participants` and `/event count` track attendees, `/event remove` and `/event clear` manage data, `/event blacklist add|remove|list` manages the blacklist."
    },
    banzone: {
        title: "☠️ Ban Zone",
        vi: "Hệ thống bảo vệ server: `/setbanchannel true|false` chỉ định kênh Ban Zone, `/banzone mode:ban` hoặc `mode:mute duration:10m` đặt chế độ xử lý, `/banwhitelist` quản lý danh sách miễn trừ (chỉ Server Owner, tách biệt từng server).",
        en: "The server protection system: `/setbanchannel true|false` sets the Ban Zone channel, `/banzone mode:ban` or `mode:mute duration:10m` sets the processing mode, `/banwhitelist` manages the exempt list (Server Owner only, isolated per server)."
    },
    whitelist: {
        title: "📋 /banwhitelist",
        vi: "`/banwhitelist add|remove|list @user` — Quản lý whitelist miễn trừ Ban Zone. **Chỉ Server Owner**; whitelist tách biệt theo từng server — Server A không ảnh hưởng Server B.",
        en: "`/banwhitelist add|remove|list @user` — Manage the Ban Zone exempt whitelist. **Server Owner only**; the whitelist is isolated per server — Server A never affects Server B."
    },
    trust: {
        title: "🤝 /trust",
        vi: "`/trust add|remove|list` — Quản lý danh sách người được tin cậy. Người được tin cậy có thể nhận quyền quản lý War theo hệ thống phân quyền của bot.",
        en: "`/trust add|remove|list` — Manage trusted users. Trusted users can receive War management access according to the bot's permission system."
    },
    config: {
        title: "⚙️ /config",
        vi: "`/config view` xem toàn bộ cấu hình; `/config help_channel`, `war_ping_role`, `backup_ping_role`, `joined_war_role`, `joined_backup_role`, `hacker_role` thiết lập kênh và role cho các hệ thống.",
        en: "`/config view` shows the full configuration; `/config help_channel`, `war_ping_role`, `backup_ping_role`, `joined_war_role`, `joined_backup_role`, `hacker_role` set up channels and roles for the systems."
    },
    persona: {
        title: "🎭 !persona",
        vi: "`!persona <code>` đổi tính cách AI; `!persona custom: <description>` tạo persona riêng; `!mypersona` để xem và `!resetpersona` để đặt lại.",
        en: "`!persona <code>` switches the AI personality; `!persona custom: <description>` creates your own; `!mypersona` to view and `!resetpersona` to reset."
    },
    setai: {
        title: "✨ !setai / /setai",
        vi: "`!setai` hoặc `/setai` — Biến kênh hiện tại thành kênh AI: người dùng chat thoải mái không cần gõ `!chat`. Tắt bằng `!unsetai`.",
        en: "`!setai` or `/setai` — Turns the current channel into an AI channel: users chat freely without typing `!chat`. Disable with `!unsetai`."
    },
    language: {
        title: "🌐 !language / /language",
        vi: "`!language <vi|en>` hoặc `/language` — Đặt ngôn ngữ Nova dùng để trả lời bạn.",
        en: "`!language <vi|en>` or `/language` — Sets the language Nova uses to reply to you."
    },
    end: {
        title: "🏁 /end all",
        vi: "`/end all` — Kết thúc **tất cả** phiên War/Backup đang hoạt động trong server hiện tại.",
        en: "`/end all` — Ends **all** active War/Backup sessions in the current server."
    },
    callhacker: {
        title: "📟 /callhacker",
        vi: "`/callhacker show` hoặc `/callhacker hide` — Ẩn/hiện nút Call Hacker. Cấu hình bằng quyền cấp quản lý.",
        en: "`/callhacker show` or `/callhacker hide` — Show or hide the Call Hacker button. Configurable with manager-level permissions."
    },
    help: {
        title: "📖 !help / /help",
        vi: "`!help` mở **Categories Help Menu**; `!help <feature>` chỉ hiển thị trợ giúp chi tiết của đúng tính năng đó — không hiện cả category.",
        en: "`!help` opens the **Categories Help Menu**; `!help <feature>` shows only the detailed help for that feature — never the whole category."
    },
    clearchat: {
        title: "🧹 !clearchat / /clearchat",
        vi: "`!clearchat` hoặc `/clearchat` — Xóa lịch sử hội thoại AI của riêng bạn để bắt đầu cuộc trò chuyện mới.",
        en: "`!clearchat` or `/clearchat` — Clears your personal AI conversation history so you can start a fresh conversation."
    }
};

const HELP_ALIASES = {
    "warping": "warping", "war ping": "warping", "backupping": "backup", "backup ping": "backup",
    "banzone": "banzone", "ban zone": "banzone", "banchannel": "banzone", "ban channel": "banzone",
    "ai": "chat", "chatbot": "chat", "ảnh": "image", "anh": "image", "img": "image",
    "thongtin": "info", "thông tin": "info", "serverinfo": "serverinfo", "userinfo": "userinfo",
    "ngonngu": "language", "ngôn ngữ": "language", "tinhcach": "persona", "endall": "end",
    "setai": "setai", "aichannel": "setai", "xuly": "banzone", "sk": "event", "sukien": "event", "sự kiện": "event"
};

/* hero chat card content */
const HERO_CHAT = {
    vi: {
        user: "!chat gợi ý vài cái tên server thật ngầu",
        bot: "Chào bạn, mình là <strong>Nova</strong> ✨ Thử nhé: <strong>Thiên Hà Đỏ</strong>, <strong>Nova Hub</strong>, <strong>Vùng Trời Xa</strong>… Bạn thích vibe nào nhất?"
    },
    en: {
        user: "!chat suggest a few cool server names",
        bot: "Hey, <strong>Nova</strong> here ✨ Try: <strong>Red Galaxy</strong>, <strong>Nova Hub</strong>, <strong>Deep Sky</strong>… Which vibe do you like best?"
    }
};

/* ================= LANGUAGE SYSTEM ================= */
function applyStaticI18n() {
    $$("[data-i18n]").forEach((el) => { el.textContent = L(el.dataset.i18n); });
    $$("[data-i18n-html]").forEach((el) => { el.innerHTML = L(el.dataset.i18nHtml); });
    $$("[data-i18n-ph]").forEach((el) => { el.placeholder = L(el.dataset.i18nPh); });
    $$("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", L(el.dataset.i18nAria)); });
    const pageTitle = LANG === "en" ? document.body.dataset.titleEn : document.body.dataset.titleVi;
    document.title = pageTitle || L("doc.title");
    document.documentElement.lang = LANG;
    document.documentElement.dataset.lang = LANG;

    const chat = HERO_CHAT[LANG];
    const userMsg = $("#heroUserMsg");
    const botMsg = $("#heroBotMsg");
    if (userMsg) userMsg.innerHTML = '<span class="cmd-inline">' + esc(chat.user.replace("!chat ", "")) + "</span>";
    if (botMsg) botMsg.innerHTML = chat.bot;
}

function setLang(lang, persist = true) {
    LANG = lang === "en" ? "en" : "vi";
    if (persist) storeSet("nova_lang", LANG);
    applyStaticI18n();
    if (document.body.dataset.page === "home") {
        renderFeatures();
        if (window.__drawCatChips) window.__drawCatChips();
        renderCommandDirectory();
        renderHelpMenu();
        renderHelpDetail($("#helpSelect") ? $("#helpSelect").value : "");
        runHelpSim($("#simInput") ? $("#simInput").value || "info" : "info", false);
        if (lastQuery) runSearch(lastQuery);
    }
    $$(".seg button").forEach((b) => {
        b.setAttribute("aria-pressed", String(b.dataset.lang === LANG));
    });
}

/* ================= NAVBAR ================= */
function initNavbar() {
    const navbar = $(".navbar");
    const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const menuBtn = $("#menuBtn");
    const mobileMenu = $("#mobileMenu");
    if (menuBtn && mobileMenu) {
        const close = () => {
            mobileMenu.classList.remove("open");
            menuBtn.setAttribute("aria-expanded", "false");
        };
        menuBtn.addEventListener("click", () => {
            const open = mobileMenu.classList.toggle("open");
            menuBtn.setAttribute("aria-expanded", String(open));
        });
        $$("a", mobileMenu).forEach((a) => a.addEventListener("click", close));
        document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    }

    $$(".seg button").forEach((b) => {
        b.addEventListener("click", () => setLang(b.dataset.lang));
    });

    /* wire every invite/support link from CONFIG */
    $$("[data-invite]").forEach((a) => {
        a.href = CONFIG.BOT_INVITE_URL;
        a.target = "_blank"; a.rel = "noopener noreferrer";
    });
    $$("[data-support]").forEach((a) => {
        a.href = CONFIG.SUPPORT_SERVER_URL;
        a.target = "_blank"; a.rel = "noopener noreferrer";
    });
    $$("[data-mailto]").forEach((a) => { a.href = "mailto:" + CONFIG.CONTACT_EMAIL; });
    $$("#ownerHandle, .js-owner").forEach((el) => { el.textContent = CONFIG.BOT_OWNER; });
    $$(".js-year").forEach((el) => { el.textContent = new Date().getFullYear(); });
}

/* ================= AMBIENT STAR CANVAS ================= */
function initStars() {
    const canvas = $("#stars");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, stars = [], raf = null;

    const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.width = window.innerWidth * dpr;
        h = canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.min(90, Math.floor(window.innerWidth / 16));
        stars = Array.from({ length: count }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 1.4 + 0.4,
            vx: (Math.random() - 0.5) * 0.06,
            vy: (Math.random() - 0.5) * 0.06,
            a: Math.random() * 0.5 + 0.2,
            tw: Math.random() * Math.PI * 2,
            hue: Math.random() < 0.14 ? "255,199,107" : Math.random() < 0.5 ? "95,224,255" : "207,220,245"
        }));
    };

    const draw = (still) => {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (const s of stars) {
            if (!still) {
                s.x += s.vx; s.y += s.vy; s.tw += 0.02;
                if (s.x < -4) s.x = window.innerWidth + 4;
                if (s.x > window.innerWidth + 4) s.x = -4;
                if (s.y < -4) s.y = window.innerHeight + 4;
                if (s.y > window.innerHeight + 4) s.y = -4;
            }
            const alpha = still ? s.a : s.a * (0.6 + 0.4 * Math.sin(s.tw));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.hue},${alpha})`;
            ctx.fill();
        }
    };

    const loop = () => {
        if (!document.hidden) draw(false);
        raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", () => { resize(); if (REDUCED) draw(true); }, { passive: true });

    if (REDUCED) {
        draw(true);
    } else {
        loop();
        document.addEventListener("visibilitychange", () => {
            if (document.hidden && raf) { cancelAnimationFrame(raf); raf = null; }
            else if (!raf) loop();
        });
    }
}

/* ================= SCRAMBLE TITLE ================= */
function initScramble() {
    const el = $("#heroTitle");
    if (!el) return;
    const finalText = "Nova";
    if (REDUCED) { el.textContent = finalText; return; }
    const glyphs = "◆✦◇*+·NOVA✧<>/";
    let frame = 0;
    const total = 26;
    const tick = () => {
        frame++;
        let out = "";
        for (let i = 0; i < finalText.length; i++) {
            const reveal = frame / total > (i + 1) / finalText.length + 0.15;
            out += reveal ? finalText[i] : glyphs[Math.floor(Math.random() * glyphs.length)];
        }
        el.textContent = out;
        if (frame < total + 4) requestAnimationFrame(tick);
        else el.textContent = finalText;
    };
    requestAnimationFrame(tick);
}

/* ================= SCROLL REVEAL ================= */
function initReveal() {
    const els = $$(".reveal");
    if (REDUCED || !("IntersectionObserver" in window)) {
        els.forEach((el) => el.classList.add("in"));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
            if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        }
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
}

/* ================= FEATURE CARDS + MODAL ================= */
function featureCardHTML(f) {
    const cmdCount = COMMANDS.filter((c) => c.cat === (f.id === "helpsys" ? "help" : f.id)).length;
    return `
    <button class="fcard reveal size-${f.size}" data-feature="${f.id}" aria-haspopup="dialog">
        <span class="fcard-top">
            <span class="fcard-ico" aria-hidden="true">${f.title[LANG].slice(0, 2)}</span>
            <span class="fcard-count">${cmdCount} ${L("feat.cmdsSuffix")}</span>
        </span>
        <span class="fcard-tag">${t(f.tag)}</span>
        <span class="fcard-title">${esc(f.title[LANG])}</span>
        <span class="fcard-desc">${esc(t(f.desc))}</span>
        <span class="fcard-foot">${L("feat.open")}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </span>
    </button>`;
}

function renderFeatures() {
    const grid = $("#featuresGrid");
    if (!grid) return;
    grid.innerHTML = FEATURES.map(featureCardHTML).join("");
    $$(".fcard", grid).forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
            card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
        });
        card.addEventListener("click", () => openFeatureModal(card.dataset.feature));
    });
    /* re-observe newly added reveal elements */
    if (!REDUCED && "IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
            for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        }, { threshold: 0.1 });
        $$(".reveal:not(.in)", grid).forEach((el) => io.observe(el));
    } else {
        $$(".reveal", grid).forEach((el) => el.classList.add("in"));
    }
}

let lastFocus = null;
function openFeatureModal(id) {
    const f = FEATURES.find((x) => x.id === id);
    if (!f) return;
    const dirCat = f.id === "helpsys" ? "help" : f.id;
    const cmds = COMMANDS.filter((c) => c.cat === dirCat);
    const backdrop = $("#modalBackdrop");
    const modal = $("#featureModal");
    lastFocus = document.activeElement;

    $("#modalIco").textContent = f.title[LANG].slice(0, 2);
    $("#modalTitle").textContent = f.title[LANG];
    $("#modalTag").textContent = t(f.tag);

    let html = `<p>${md(t(f.intro))}</p>`;
    html += `<div class="m-block"><h4>${L("modal.cmdsTitle")}</h4><div class="m-cmds">` +
        cmds.map((c) => `<div class="m-cmd"><code>${esc(c.cmd)}</code><span>${esc(t({ vi: c.vi, en: c.en }))}</span></div>`).join("") +
        `</div></div>`;
    f.blocks.forEach((b) => {
        html += `<div class="m-block"><h4>${esc(t(b.h))}</h4><p>${md(t(b.p))}</p></div>`;
    });
    html += `<div class="m-block"><h4>${L("modal.permsTitle")}</h4><div class="m-note info">${md(t(f.perms))}</div></div>`;
    if (f.notes) html += `<div class="m-block"><h4>${L("modal.notesTitle")}</h4><div class="m-note">${md(t(f.notes))}</div></div>`;
    if (f.examples && f.examples.length) {
        html += `<div class="m-block"><h4>${L("modal.examplesTitle")}</h4><div class="m-cmds">` +
            f.examples.map((ex) => `<div class="m-cmd"><code>${esc(ex.c)}</code><span>${esc(t(ex.d))}</span></div>`).join("") +
            `</div></div>`;
    }
    $("#modalBody").innerHTML = html;

    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    $("#modalClose").focus();
}

function closeModal() {
    const backdrop = $("#modalBackdrop");
    if (!backdrop || !backdrop.classList.contains("open")) return;
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
}

function initModal() {
    const backdrop = $("#modalBackdrop");
    if (!backdrop) return;
    $("#modalClose").addEventListener("click", closeModal);
    backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
        if (e.key === "Tab" && backdrop.classList.contains("open")) {
            const focusables = $$('button, [href], input, select, [tabindex]:not([tabindex="-1"])', $("#featureModal"));
            if (!focusables.length) return;
            const first = focusables[0], last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });
}

/* ================= COMMAND DIRECTORY ================= */
let activeCat = "all";
let lastQuery = "";

function permText(c) {
    if (c.permNote) return t(c.permNote);
    return t(PERM_LABELS[c.perm]);
}

function cmdRowHTML(c) {
    const typeLabel = c.type === "prefix" ? L("cmd.typePrefix") : c.type === "slash" ? L("cmd.typeSlash") : L("cmd.typeButton");
    const badges =
        (c.isNew ? `<span class="badge-new">${L("cmd.newBadge")}</span>` : "") +
        (c.perm === 4 ? `<span class="badge-owner">${L("cmd.ownerBadge")}</span>` : "");
    return `
    <div class="cmd-row" data-cmd="${esc(c.cmd)}" id="cmd-${esc(c.cmd.replace(/[^a-z0-9]+/gi, "-").toLowerCase())}">
        <div class="cmd-name"><code>${esc(c.cmd)}</code>${badges}</div>
        <span class="type-tag ${c.type}">${typeLabel}</span>
        <div class="cmd-desc">
            ${esc(t({ vi: c.vi, en: c.en }))}
            <div class="perm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
                ${L("cmd.permLabel")}: ${esc(permText(c))}
            </div>
        </div>
        ${c.ex ? `<span class="cmd-example">${esc(c.ex)}</span>` : ""}
    </div>`;
}

function renderCommandDirectory() {
    const listEl = $("#cmdList");
    if (!listEl) return;
    const q = lastQuery.trim().toLowerCase();
    const qNorm = norm(q);
    const rawMatch = (c) => {
        const catName = t(CATS[c.cat].name).toLowerCase();
        return [c.cmd, c.vi, c.en, permText(c), catName, c.type].join(" ").toLowerCase().includes(q);
    };
    const normMatch = (c) => {
        const catName = t(CATS[c.cat].name);
        return norm([c.cmd, c.vi, c.en, permText(c), catName, c.type].join(" ")).includes(qNorm);
    };
    const cats = activeCat === "all" ? Object.keys(CATS) : [activeCat];
    let html = "";
    let total = 0;
    for (const cat of cats) {
        let rows = COMMANDS.filter((c) => c.cat === cat && (!q || rawMatch(c)));
        if (q && !rows.length) rows = COMMANDS.filter((c) => c.cat === cat && normMatch(c));
        if (!rows.length) continue;
        total += rows.length;
        html += `
        <section class="cmd-group">
            <header class="cmd-group-head">
                <span class="cg-emoji" aria-hidden="true">${CATS[cat].emoji}</span>
                <h3>${esc(t(CATS[cat].name))}</h3>
                <span class="cg-count">${rows.length}</span>
                <span class="cg-line"></span>
            </header>
            <div class="cmd-list">${rows.map(cmdRowHTML).join("")}</div>
        </section>`;
    }

    const foundEl = $("#cmdFound");
    foundEl.textContent = q
        ? `${total} ${total === 1 ? L("cmd.foundOne") : L("cmd.found")}`
        : `${COMMANDS.length} ${L("cmd.total")}`;

    if (!total) {
        const suggestions = ["info", "chat", "ban", "warping", "event", "persona"];
        html = `
        <div class="no-results glass">
            <h3 style="font-family:var(--font-display);color:#fff;font-size:1.1rem">${L("cmd.noneTitle")}</h3>
            <p>${esc(lastQuery)} — ${L("cmd.noneBody")}</p>
            <div class="suggest">${suggestions.map((s) => `<button class="sim-chip" data-suggest="${s}">${s}</button>`).join("")}</div>
        </div>`;
    }
    listEl.innerHTML = html;
    $$("[data-suggest]", listEl).forEach((b) => {
        b.addEventListener("click", () => {
            const input = $("#globalSearch");
            input.value = b.dataset.suggest;
            lastQuery = b.dataset.suggest;
            runSearch(lastQuery);
            renderCommandDirectory();
            input.focus();
        });
    });
}

function initCatChips() {
    const wrap = $("#catChips");
    if (!wrap) return;
    const chips = [{ id: "all", label: () => L("cmd.all") }]
        .concat(Object.keys(CATS).map((id) => ({ id, label: () => CATS[id].emoji + " " + t(CATS[id].name) })));
    const draw = () => {
        wrap.innerHTML = chips.map((c) =>
            `<button class="cat-chip${c.id === activeCat ? " active" : ""}" data-cat="${c.id}">${esc(c.label())}</button>`
        ).join("");
        $$("[data-cat]", wrap).forEach((b) => {
            b.addEventListener("click", () => { activeCat = b.dataset.cat; draw(); renderCommandDirectory(); });
        });
    };
    draw();
    window.__drawCatChips = draw;
}

/* ================= GLOBAL SEARCH ================= */
function norm(s) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
}

function runSearch(query) {
    lastQuery = query;
    const resultsEl = $("#searchResults");
    if (!resultsEl) return;
    const qRaw = query.trim().toLowerCase();
    const qNorm = norm(qRaw);

    if (!qRaw) {
        resultsEl.innerHTML = "";
        resultsEl.style.display = "none";
        renderCommandDirectory();
        return;
    }

    /* two-pass: exact (diacritic-aware) matches first, normalized fuzzy as supplement */
    const twoPass = (items, hayFn) => {
        const raw = items.filter((i) => hayFn(i).toLowerCase().includes(qRaw));
        return raw.concat(items.filter((i) => !raw.includes(i) && norm(hayFn(i)).includes(qNorm)));
    };

    const cmdMatches = twoPass(
        COMMANDS,
        (c) => [c.cmd, c.vi, c.en, permText(c), t(CATS[c.cat].name)].join(" ")
    ).slice(0, 8);

    const featMatches = twoPass(
        FEATURES,
        (f) => {
            const dirCat = f.id === "helpsys" ? "help" : f.id;
            return [f.title.vi, f.title.en, f.desc.vi, f.desc.en, t(CATS[dirCat].name),
                ...f.blocks.map((b) => b.h.vi + " " + b.h.en)].join(" ");
        }
    ).slice(0, 4);

    const helpMatches = twoPass(
        Object.entries(HELP_FEATURES),
        ([key, v]) => key + " " + v.title + " " + v.vi + " " + v.en
    ).slice(0, 4);

    let html = "";
    if (featMatches.length) {
        html += `<div class="sr-group"><h4>${L("cmd.srFeatures")}</h4><div class="sr-list">` +
            featMatches.map((f) => `
                <button class="sr-item" data-open-feature="${f.id}">
                    <code>${esc(f.title[LANG].slice(0, 2))}</code>
                    <span class="sr-desc"><b style="color:var(--ink)">${esc(t(f.title))}</b> · ${esc(t(f.desc))}</span>
                    <span class="sr-go">→</span>
                </button>`).join("") + `</div></div>`;
    }
    if (cmdMatches.length) {
        html += `<div class="sr-group"><h4>${L("cmd.srCommands")}</h4><div class="sr-list">` +
            cmdMatches.map((c) => `
                <button class="sr-item" data-goto-cmd="${esc(c.cmd)}">
                    <code>${esc(c.cmd)}</code>
                    <span class="sr-desc">${esc(t({ vi: c.vi, en: c.en }))}</span>
                    <span class="sr-go">→</span>
                </button>`).join("") + `</div></div>`;
    }
    if (helpMatches.length) {
        html += `<div class="sr-group"><h4>${L("cmd.srHelp")}</h4><div class="sr-list">` +
            helpMatches.map(([key, v]) => `
                <button class="sr-item" data-help-topic="${esc(key)}">
                    <code>!help ${esc(key)}</code>
                    <span class="sr-desc">${esc(v[LANG])}</span>
                    <span class="sr-go">→</span>
                </button>`).join("") + `</div></div>`;
    }

    if (!html) {
        const suggestions = ["info", "chat", "ban", "warping"];
        html = `<div class="no-results glass">
            <h3 style="font-family:var(--font-display);color:#fff;font-size:1.05rem">${L("cmd.noneTitle")}</h3>
            <p>${L("cmd.noneBody")}</p>
            <div class="suggest">${suggestions.map((s) => `<button class="sim-chip" data-suggest2="${s}">${s}</button>`).join("")}</div>
        </div>`;
    }

    resultsEl.innerHTML = html;
    resultsEl.style.display = "";

    $$("[data-open-feature]", resultsEl).forEach((b) =>
        b.addEventListener("click", () => openFeatureModal(b.dataset.openFeature)));
    $$("[data-goto-cmd]", resultsEl).forEach((b) =>
        b.addEventListener("click", () => gotoCommand(b.dataset.gotoCmd)));
    $$("[data-help-topic]", resultsEl).forEach((b) =>
        b.addEventListener("click", () => {
            const input = $("#simInput");
            input.value = b.dataset.helpTopic;
            runHelpSim(b.dataset.helpTopic, true);
            const sec = $("#help");
            if (sec) sec.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
        }));
    $$("[data-suggest2]", resultsEl).forEach((b) =>
        b.addEventListener("click", () => {
            const input = $("#globalSearch");
            input.value = b.dataset.suggest2;
            runSearch(b.dataset.suggest2);
            input.focus();
        }));

    renderCommandDirectory();
}

function gotoCommand(cmd) {
    activeCat = "all";
    lastQuery = "";
    const input = $("#globalSearch");
    if (input) input.value = "";
    if (window.__drawCatChips) window.__drawCatChips();
    renderCommandDirectory();
    const resultsEl = $("#searchResults");
    if (resultsEl) { resultsEl.innerHTML = ""; resultsEl.style.display = "none"; }
    const id = "cmd-" + cmd.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const row = document.getElementById(id);
    if (row) {
        row.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "center" });
        row.classList.remove("flash");
        void row.offsetWidth;
        row.classList.add("flash");
    }
}

function initSearch() {
    const input = $("#globalSearch");
    if (!input) return;
    let debounce;
    input.addEventListener("input", () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => runSearch(input.value), 120);
    });
    input.addEventListener("keydown", (e) => {
        if (e.key === "Escape") { input.value = ""; runSearch(""); }
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
            e.preventDefault();
            input.focus();
            input.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "center" });
        }
    });
}

/* ================= HELP MENU PREVIEW ================= */
let ownerMode = false;

function renderHelpMenu() {
    const m = HELP_MENU[LANG];
    const frame = $("#helpMenuFrame");
    if (!frame) return;
    const catsHtml = HELP_CATS.map((c) => `
        <div class="em-field">
            <b>${c.emoji} ${esc(c.name)}</b>
            <span>${esc(t(c.desc))}</span>
        </div>`).join("");
    frame.innerHTML = `
        <div class="dc-author">
            <img src="${CONFIG.BOT_AVATAR}" alt="" width="28" height="28">
            <b>${esc(m.author)}</b>
            <span class="bot-badge">BOT</span>
        </div>
        <div class="embed">
            <h5>${m.title}</h5>
            <p>${md(m.body)}</p>
            <div class="em-field"><b>${m.catsTitle}</b></div>
            ${catsHtml}
            <div class="em-field tip-embed-inline"></div>
        </div>
        <div class="embed tip-embed">
            <h5>${m.tipTitle}</h5>
            <p>${esc(m.tipBody)}</p>
        </div>
        <div class="embed" style="border-left-color: var(--faint); background: rgba(24,30,50,0.55);">
            <p style="color:var(--muted)">${esc(m.footer)}</p>
        </div>
        <div class="dc-select-row">
            <div class="dc-select">
                <label class="sr-only" for="helpSelect">${L("help.selectLabel")}</label>
                <select id="helpSelect">
                    <option value="">${esc(m.placeholder)}</option>
                    ${HELP_CATS.map((c) => `<option value="${c.id}">${c.emoji} ${esc(c.name)}</option>`).join("")}
                </select>
            </div>
        </div>
        <div id="helpDetail" aria-live="polite"></div>`;
    $("#helpSelect").addEventListener("change", (e) => renderHelpDetail(e.target.value));
}

function renderHelpDetail(catId) {
    const el = $("#helpDetail");
    if (!el) return;
    if (!catId) { el.innerHTML = ""; return; }
    const cat = HELP_CATS.find((c) => c.id === catId);
    if (!cat) return;
    const m = HELP_MENU[LANG];

    if (cat.id === "admin" && !ownerMode) {
        el.innerHTML = `
        <div class="embed red-embed locked">
            <h5>${L("help.lockedTitle")}</h5>
            <p>${L("help.lockedBody")}</p>
        </div>`;
        return;
    }

    const cmds = COMMANDS.filter((c) => c.cat === cat.dirCat);
    el.innerHTML = `
    <div class="embed cyan-embed" style="margin-top:10px">
        <h5>${cat.emoji} ${esc(cat.name)} — ${esc(m.detailPrefix)}</h5>
        ${cmds.map((c) => `
            <div class="em-field">
                <b class="em-cmd">${esc(c.cmd)}</b>
                <span>${esc(t({ vi: c.vi, en: c.en }))}</span>
            </div>`).join("")}
    </div>`;
}

function initHelpPreview() {
    const toggle = $("#ownerToggle");
    if (toggle) {
        toggle.addEventListener("change", () => {
            ownerMode = toggle.checked;
            const sel = $("#helpSelect");
            renderHelpDetail(sel ? sel.value : "");
        });
    }

    const input = $("#simInput");
    const send = $("#simSend");
    if (input && send) {
        const go = () => runHelpSim(input.value, true);
        send.addEventListener("click", go);
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); });
    }
    $$(".sim-chip[data-sim]").forEach((chip) => {
        chip.addEventListener("click", () => {
            if (input) input.value = chip.dataset.sim;
            runHelpSim(chip.dataset.sim, true);
        });
    });
    runHelpSim("info", false);
}

function resolveHelpKey(raw) {
    let key = norm(raw.trim().toLowerCase()).replace(/^!help\s+/i, "").replace(/^\/help\s+/i, "").trim();
    if (!key) return null;
    if (HELP_FEATURES[key]) return key;
    if (HELP_ALIASES[key]) return HELP_ALIASES[key];
    const compact = key.replace(/\s+/g, "");
    if (HELP_FEATURES[compact]) return compact;
    if (HELP_ALIASES[compact]) return HELP_ALIASES[compact];
    /* fuzzy: startsWith */
    const hit = Object.keys(HELP_FEATURES).find((k) => k.startsWith(key) || key.startsWith(k));
    return hit || null;
}

function runHelpSim(raw, animate) {
    const out = $("#simOutput");
    if (!out) return;
    const key = resolveHelpKey(raw);
    if (!key) {
        const suggestions = ["chat", "info", "ban", "mute", "warping", "event", "banzone"];
        out.innerHTML = `
        <div class="embed red-embed">
            <h5>${L("help.unknownTitle")}</h5>
            <p>${L("help.unknownBody")}</p>
            <div class="em-field"><span class="em-cmd">${suggestions.join(" · ")}</span></div>
        </div>`;
        return;
    }
    const f = HELP_FEATURES[key];
    out.innerHTML = `
    <div class="embed cyan-embed" ${animate && !REDUCED ? 'style="animation:embedIn .4s var(--ease) both"' : ""}>
        <h5>${f.title}</h5>
        <p>${md(f[LANG])}</p>
        <div class="em-footer">!help ${esc(key)} · Nova</div>
    </div>`;
}

/* ================= INIT ================= */
function init() {
    const saved = storeGet("nova_lang");
    LANG = saved === "en" ? "en" : "vi";

    initNavbar();
    applyStaticI18n();
    initStars();
    initModal();

    if (document.body.dataset.page === "home") {
        renderFeatures();
        initCatChips();
        renderCommandDirectory();
        initSearch();
        renderHelpMenu();
        initHelpPreview();
        initScramble();
    }

    initReveal();

    $$(".seg button").forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.lang === LANG)));
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
