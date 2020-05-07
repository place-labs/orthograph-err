// LICENSE : MIT
"use strict";
const createSections = require("select-section");
module.exports = function(context) {
    const {Syntax, RuleError, report, getSource} = context;
    /**
     * if `section` contain only Header nodes, return true
     * @param {Object} section
     * @returns {boolean}
     */
    const isHeaderOnly = (section) => {
        var notHeaderNodes = section.children.filter(child => {
            return child.type !== Syntax.Header;
        });
        return notHeaderNodes.length === 0;
    };
    /**
     * find first Header Node in the `section`
     * @param {Object} section
     * @returns {TxtNode}
     */
    const findFirstHeader = (section) => {
        var headerNodes = section.children.filter(child => {
            return child.type === Syntax.Header;
        });
        return headerNodes[0];
    };
    /**
     * if `section` is empty, return true
     * @param {Object} section
     * @returns {boolean}
     */
    const isEmptySection = (section) => {
        if (!Array.isArray(section.children)) {
            return false;
        }
        return isHeaderOnly(section);

    };
    return {
        [Syntax.Document](node){
            const sections = createSections(node);
            sections.filter(isEmptySection).forEach(section => {
                const header = findFirstHeader(section);
                if (!header) {
                    return;
                }
                report(node, new RuleError(`Found empty section: \`${getSource(header)}\``, {
                    index: section.range[0]
                }));
            });
        }
    };
};