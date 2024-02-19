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
fastify.get("/post", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var author, postContent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                author = "Alexander Berkov";
                return [4 /*yield*/, (0, promises_1.readFile)("./files/hello-world.txt", "utf8")];
            case 1:
                postContent = _a.sent();
                sendHTML(res, React.createElement("html", null,
                    React.createElement("head", null,
                        React.createElement("title", null, "My blog")),
                    React.createElement("body", null,
                        React.createElement("nav", null,
                            React.createElement("a", { href: "/" }, "Home"),
                            React.createElement("hr", null)),
                        React.createElement("article", null, escapeHtml(postContent)),
                        React.createElement("footer", null,
                            React.createElement("hr", null),
                            React.createElement("p", null,
                                React.createElement("i", null,
                                    "(c) ",
                                    escapeHtml(author),
                                    ", ",
                                    new Date().getFullYear()))))));
                return [2 /*return*/];
        }
    });
}); });
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
        }
        else
            throw new Error("Cannot render an object.");
    }
    else
        throw new Error("Not implemented.");
}
