"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var promises_1 = require("fs/promises");
var escapeHtml = require("escape-html");
// Import the framework and instantiate it
var fastify_1 = require("fastify");
var fastify = (0, fastify_1.default)({
    logger: true,
});
// Run the server!
fastify
    .listen({ port: 3000 })
    .then()
    .catch(function (err) {
    fastify.log.error(err);
    process.exit(1);
});
fastify.get("/*", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var url, _a, _b, err_1;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                url = new URL(req.url, "http://".concat(req.headers.host));
                if (url.pathname === "/favicon.ico") {
                    res.send();
                    return [2 /*return*/];
                }
                _d.label = 1;
            case 1:
                _d.trys.push([1, 4, , 5]);
                _a = sendHTML;
                _b = [res];
                return [4 /*yield*/, (React.createElement(Router, { url: url }))];
            case 2: return [4 /*yield*/, _a.apply(void 0, _b.concat([_d.sent()]))];
            case 3:
                _d.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _d.sent();
                console.error(err_1);
                res.statusCode = (_c = err_1.statusCode) !== null && _c !== void 0 ? _c : 500;
                res.send();
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
function Router(_a) {
    var url = _a.url;
    return __awaiter(this, void 0, void 0, function () {
        var page, postSlug;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(url.pathname === "/")) return [3 /*break*/, 2];
                    return [4 /*yield*/, (React.createElement(BlogIndexPage, null))];
                case 1:
                    page = _b.sent();
                    return [3 /*break*/, 4];
                case 2:
                    postSlug = url.pathname.slice(1);
                    return [4 /*yield*/, (React.createElement(BlogPostPage, { postSlug: postSlug }))];
                case 3:
                    page = _b.sent();
                    _b.label = 4;
                case 4: return [4 /*yield*/, (React.createElement(BlogLayout, { children: page }, page))];
                case 5: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
function sendHTML(res, jsx) {
    return __awaiter(this, void 0, void 0, function () {
        var html;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, renderJSXToHTML(jsx)];
                case 1:
                    html = _a.sent();
                    res.header("Content-Type", "text/html");
                    res.send(html);
                    return [2 /*return*/];
            }
        });
    });
}
function renderJSXToHTML(jsx) {
    return __awaiter(this, void 0, void 0, function () {
        var childrenHtml, html, propName, _a, Component, props, returnedJsx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(typeof jsx === "string" || typeof jsx === "number")) return [3 /*break*/, 1];
                    // This is a string. Escape it and put it into HTML directly.
                    return [2 /*return*/, escapeHtml(jsx)];
                case 1:
                    if (!(jsx == null || typeof jsx === "boolean")) return [3 /*break*/, 2];
                    // This is an empty node. Don't emit anything in HTML for it.
                    return [2 /*return*/, ""];
                case 2:
                    if (!Array.isArray(jsx)) return [3 /*break*/, 4];
                    return [4 /*yield*/, Promise.all(jsx.map(function (child) { return renderJSXToHTML(child); }))];
                case 3:
                    childrenHtml = _b.sent();
                    return [2 /*return*/, childrenHtml.join("")];
                case 4:
                    if (!(typeof jsx === "object")) return [3 /*break*/, 11];
                    if (!(jsx.$$typeof === Symbol.for("react.element"))) return [3 /*break*/, 10];
                    if (!(typeof jsx.type === "string")) return [3 /*break*/, 6];
                    html = "<" + jsx.type;
                    for (propName in jsx.props) {
                        if (jsx.props.hasOwnProperty(propName) && propName !== "children") {
                            html += " ";
                            html += propName;
                            html += "=";
                            html += escapeHtml(jsx.props[propName]);
                        }
                    }
                    html += ">";
                    _a = html;
                    return [4 /*yield*/, renderJSXToHTML(jsx.props.children)];
                case 5:
                    html = _a + _b.sent();
                    html += "</" + jsx.type + ">";
                    return [2 /*return*/, html];
                case 6:
                    if (!(typeof jsx.type === "function")) return [3 /*break*/, 9];
                    Component = jsx.type;
                    props = jsx.props;
                    return [4 /*yield*/, Component(props)];
                case 7:
                    returnedJsx = _b.sent();
                    console.debug({ returnedJsx: returnedJsx });
                    return [4 /*yield*/, renderJSXToHTML(returnedJsx)];
                case 8: return [2 /*return*/, _b.sent()];
                case 9: throw new Error("Not implemented.");
                case 10: return [3 /*break*/, 12];
                case 11: throw new Error("Not implemented.");
                case 12: return [2 /*return*/];
            }
        });
    });
}
function Post(_a) {
    var slug = _a.slug;
    return __awaiter(this, void 0, void 0, function () {
        var content, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, promises_1.readFile)("./files/" + slug + ".txt", "utf8")];
                case 1:
                    content = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _b.sent();
                    throwNotFound(err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, (React.createElement("section", null,
                        React.createElement("h2", null,
                            React.createElement("a", { href: "/" + slug }, slug)),
                        React.createElement("article", null, content)))];
            }
        });
    });
}
function BlogLayout(_a) {
    var children = _a.children;
    var author = "Jae Doe";
    return (React.createElement("html", null,
        React.createElement("head", null,
            React.createElement("title", null, "My blog")),
        React.createElement("body", null,
            React.createElement("nav", null,
                React.createElement("a", { href: "/" }, "Home"),
                React.createElement("hr", null)),
            React.createElement("main", null, children),
            React.createElement(Footer, { author: author }))));
}
function BlogPostPage(_a) {
    var postSlug = _a.postSlug;
    return React.createElement(Post, { slug: postSlug });
}
function BlogIndexPage() {
    return __awaiter(this, void 0, void 0, function () {
        var postFiles, postSlugs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.readdir)("./files")];
                case 1:
                    postFiles = _a.sent();
                    postSlugs = postFiles.map(function (file) {
                        return file.slice(0, file.lastIndexOf("."));
                    });
                    return [2 /*return*/, (React.createElement("section", null,
                            React.createElement("h1", null, "Welcome to my blog"),
                            React.createElement("div", null, postSlugs.map(function (slug) { return (React.createElement(Post, { slug: slug })); }))))];
            }
        });
    });
}
function Footer(_a) {
    var author = _a.author;
    return (React.createElement("footer", null,
        React.createElement("hr", null),
        React.createElement("p", null,
            React.createElement("i", null,
                "(c) ",
                author,
                " ",
                new Date().getFullYear()))));
}
function throwNotFound(cause) {
    var notFound = new Error("Not found. ".concat(cause));
    throw notFound;
}
