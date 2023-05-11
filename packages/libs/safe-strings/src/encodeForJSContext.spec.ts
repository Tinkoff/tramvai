import { encodeForJSContext } from './encodeForJSContext';

describe('encodeForJSContext', () => {
  it('Escapes slashes', () => {
    expect(encodeForJSContext('</script><script>alert("xss")')).toMatchInlineSnapshot(
      `"\\u003C/script>\\u003Cscript>alert("xss")"`
    );
  });

  it('Escapes exclamation marks', () => {
    expect(encodeForJSContext('<!--</script>...-->alert("xss")')).toMatchInlineSnapshot(
      `"\\u003C!--\\u003C/script>...-->alert("xss")"`
    );
  });

  it('Escapes line and paragraph separators', () => {
    expect(
      encodeForJSContext(
        'Как быстро\u2028 открыть расчетный \u2029счет для ИП?<script>var a=5;</script>'
      )
    ).toMatchInlineSnapshot(
      `"Как быстро\\u2028 открыть расчетный \\u2029счет для ИП?\\u003Cscript>var a=5;\\u003C/script>"`
    );
  });
});
