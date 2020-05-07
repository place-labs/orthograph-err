// LICENSE : MIT
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getMessageType(message) {
    if (message.fatal || message.severity === 2) {
        return "Error";
    }
    else {
        return "Warning";
    }
}
function format(results) {
    var output = "";
    var total = 0;
    results.forEach(function (result) {
        var messages = result.applyingMessages;
        total += messages.length;
        messages.forEach(function (message) {
            output += "Fixed✔ ";
            output += result.filePath + ": ";
            output += "line " + (message.line || 0);
            output += ", col " + (message.column || 0);
            output += ", " + getMessageType(message);
            output += " - " + message.message;
            output += message.ruleId ? " (" + message.ruleId + ")" : "";
            output += "\n";
        });
    });
    if (total > 0) {
        output += "\n\nFixed " + total + " problem" + (total !== 1 ? "s" : "");
    }
    return output;
}
exports.format = format;
//# sourceMappingURL=compats.js.map