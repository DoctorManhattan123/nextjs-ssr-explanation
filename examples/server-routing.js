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
    var url, page, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                url = new URL(req.url, "http://".concat(req.headers.host));
                return [4 /*yield*/, matchRoute(url)];
            case 1:
                page = _b.sent();
                sendHTML(res, React.createElement(BlogLayout, { children: page }));
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                console.error(err_1);
                res.statusCode = (_a = err_1.statusCode) !== null && _a !== void 0 ? _a : 500;
                res.send();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
function matchRoute(url) {
    return __awaiter(this, void 0, void 0, function () {
        var postFiles, postSlugs, postContents, postSlug, postContent, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(url.pathname === "/")) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, promises_1.readdir)("./files")];
                case 1:
                    postFiles = _a.sent();
                    postSlugs = postFiles.map(function (file) {
                        return file.slice(0, file.lastIndexOf("."));
                    });
                    return [4 /*yield*/, Promise.all(postSlugs.map(function (postSlug) {
                            return (0, promises_1.readFile)("./files/" + postSlug + ".txt", "utf8");
                        }))];
                case 2:
                    postContents = _a.sent();
                    return [2 /*return*/, React.createElement(BlogIndexPage, { postSlugs: postSlugs, postContents: postContents })];
                case 3:
                    postSlug = url.pathname.slice(1);
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, (0, promises_1.readFile)("./files/" + postSlug + ".txt", "utf8")];
                case 5:
                    postContent = _a.sent();
                    return [2 /*return*/, React.createElement(BlogPostPage, { postSlug: postSlug, postContent: postContent })];
                case 6:
                    err_2 = _a.sent();
                    throwNotFound(err_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function sendHTML(res, jsx) {
    var html = renderJSXToHTML(jsx);
    res.header("Content-Type", "text/html");
    res.send(html);
}
function renderJSXToHTML(jsx) {
    console.debug({ jsx: jsx });
    if (typeof jsx === "string" || typeof jsx === "number") {
        // This is a string. Escape it and put it into HTML directly.
        return escapeHtml(jsx);
    }
    else if (jsx == null || typeof jsx === "boolean") {
        // This is an empty node. Don't emit anything in HTML for it.
        return "";
    }
    else if (Array.isArray(jsx)) {
        // This is an array of nodes. Render each into HTML and concatenate.
        return jsx.map(function (child) { return renderJSXToHTML(child); }).join("");
    }
    else if (typeof jsx === "object") {
        // Check if this object is a React JSX element (e.g. <div />).
        if (jsx.$$typeof === Symbol.for("react.element")) {
            if (typeof jsx.type === "string") {
                // Turn it into an an HTML tag.
                var html = "<" + jsx.type;
                for (var propName in jsx.props) {
                    if (jsx.props.hasOwnProperty(propName) && propName !== "children") {
                        html += " ";
                        html += propName;
                        html += "=";
                        html += escapeHtml(jsx.props[propName]);
                    }
                }
                html += ">";
                html += renderJSXToHTML(jsx.props.children);
                html += "</" + jsx.type + ">";
                return html;
                // added this else statement to treat function components
            }
            else if (typeof jsx.type === "function") {
                // Is it a component like <BlogPostPage>?
                // Call the component with its props, and turn its returned JSX into HTML.
                var Component = jsx.type;
                console.debug({ Component: Component });
                var props = jsx.props;
                var returnedJsx = Component(props);
                return renderJSXToHTML(returnedJsx);
            }
            else
                throw new Error("Not implemented.");
        }
    }
    else
        throw new Error("Not implemented.");
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
    var postSlug = _a.postSlug, postContent = _a.postContent;
    return (React.createElement("section", null,
        React.createElement("h2", null,
            React.createElement("a", { href: "/" + postSlug }, postSlug)),
        React.createElement("article", null, postContent)));
}
function BlogIndexPage(_a) {
    var postSlugs = _a.postSlugs, postContents = _a.postContents;
    return (React.createElement("section", null,
        React.createElement("h1", null, "Welcome to my blog"),
        React.createElement("div", null, postSlugs.map(function (postSlug, index) { return (React.createElement("section", { key: postSlug },
            React.createElement("h2", null,
                React.createElement("a", { href: "/" + postSlug }, postSlug)),
            React.createElement("article", null, postContents[index]))); }))));
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
