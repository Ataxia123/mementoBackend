"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@/app/lib/utils");
function H1(props) {
    const { className, children, ...rest } = props;
    return (<h1 className={(0, utils_1.cn)("scroll-m-20 text-4xl font-extrabold tracking-tight", className)} {...rest}>
      {children}
    </h1>);
}
function H2(props) {
    const { className, children, ...rest } = props;
    return (<h2 className={(0, utils_1.cn)("scroll-m-20 text-3xl font-semibold tracking-tight", className)} {...rest}>
      {children}
    </h2>);
}
function H3(props) {
    const { className, children, ...rest } = props;
    return (<h3 className={(0, utils_1.cn)("scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...rest}>
      {children}
    </h3>);
}
function H4(props) {
    const { className, children, ...rest } = props;
    return (<h4 className={(0, utils_1.cn)("scroll-m-20 text-xl font-semibold tracking-tight", className)} {...rest}>
      {children}
    </h4>);
}
function P(props) {
    const { className, children, ...rest } = props;
    return (<p className={(0, utils_1.cn)("leading-7", className)} {...rest}>
      {children}
    </p>);
}
function Link(props) {
    const { className, children, ...rest } = props;
    return (<a className={(0, utils_1.cn)("font-medium text-primary underline underline-offset-4", className)} {...rest}>
      {children}
    </a>);
}
const Typography = {
    H1,
    H2,
    H3,
    H4,
    P,
    Link,
};
exports.default = Typography;
