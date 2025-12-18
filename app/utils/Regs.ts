const passwordReg = /^(?=.*[a-zA-Z])(?=.*\d).{6,18}$/;
const phoneOrEmailReg =
  /^(?:1[3-9]\d{9}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
export {passwordReg,phoneOrEmailReg}