import {message} from 'antd';

class ErrBase extends Error {}
class ErrLogin extends ErrBase {}


export default function errorHandler(err, target = '') {
  console.error(err);
  if (err instanceof ErrBase) {
    message.error(err.message);
  } else {
    let msg = `${target} 發生錯誤`;
    if (err.response && err.response.error) {
      msg =
        {
          invalid_password: '密碼錯誤',
          username_not_found: '查無此帳號，請聯絡客服',
          code_invalid_error: '驗證碼錯誤或是逾期',
        }[err.response.error] || msg;
    }

    message.error(msg);
  }
}

export {
  ErrLogin,
};
