const passwordReg = /^(?=.*[a-zA-Z])(?=.*\d).{6,18}$/;
const phoneOrEmailReg =
  /^(?:1[3-9]\d{9}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
//昵称正则表达式
// 允许：中英文（含繁体）、数字（全角/半角）、下划线、横线、中文间隔号 ·
// 长度：2-12个字符
const nicknameReg = /^[a-zA-Z0-9_\u4e00-\u9fa5\u3400-\u4dbf\u{20000}-\u{2a6df}\u{2a700}-\u{2b73f}\u{2b740}-\u{2b81f}\u{2b820}-\u{2ceaf}\u{2ceb0}-\u{2ebef}\u{30000}-\u{3134f}\uff00-\uffef·-]{2,12}$/u;

export {passwordReg,phoneOrEmailReg,nicknameReg}