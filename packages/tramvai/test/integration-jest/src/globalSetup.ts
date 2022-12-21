import { setDefaultResultOrder } from 'dns';

module.exports = () => {
  if (typeof setDefaultResultOrder === 'function') {
    setDefaultResultOrder('ipv4first');
  }
};
