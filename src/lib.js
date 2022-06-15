import $ from 'jquery';

/**
 * 建立樣板
 *
 * @param {object} el
 * @param {array} data - template render data
 * @param {function} created - callback method
 * @return {HTMLElement}
 */
export function tmpl(el, data, created) {
  const $el = $(el);

  const templateHTML = /script|template/i.test($el.prop('tagName'))
    ? $el.html()
    : $el.prop('outerHTML');

  const $compiledEl = $(
    (templateHTML || '').replace(/{{ *(.*?) *}}/g, (match, p1) => {
      try {
        return (
          [data || {}].concat(p1.split('.')).reduce((a, b) => {
            return a[b];
          }) || ''
        );
      } catch (e) {
        return '';
      }
    })
  );

  if (typeof created === 'function') {
    created($compiledEl, data);
  }

  return $compiledEl;
}

/**
 * 物件拷貝 (合併與繼承)
 *
 * @param {*} target - The target object to extend.
 * @param {*} args - The rest objects for merging to the target object.
 * @returns {Object} The extended object.
 */
export const assign =
  Object.assign ||
  function assign(target, ...args) {
    if ($.isPlainObject(target) && args.length > 0) {
      args.forEach((arg) => {
        if ($.isPlainObject(arg)) {
          Object.keys(arg).forEach((key) => {
            target[key] = arg[key];
          });
        }
      });
    }

    return target;
  };
