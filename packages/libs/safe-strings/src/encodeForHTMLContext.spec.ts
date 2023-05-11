import { encodeForHTMLContext } from './encodeForHTMLContext';

describe('encodeForHTMLContext', () => {
  it('Escapes < and > symbols', () => {
    expect(encodeForHTMLContext('<script>alert("XSS vulnerability!")</script>')).toBe(
      '&lt;script&gt;alert(&quot;XSS vulnerability!&quot;)&lt;/script&gt;'
    );
  });

  it('Escapes & symbol', () => {
    expect(encodeForHTMLContext('This & That')).toBe('This &amp; That');
  });

  it("Escapes ' symbol", () => {
    expect(encodeForHTMLContext("It's a test")).toBe('It&#039;s a test');
  });

  it('Escapes " symbol', () => {
    expect(encodeForHTMLContext('Some "quoted" text')).toBe('Some &quot;quoted&quot; text');
  });

  it('Escapes multiple symbols', () => {
    expect(
      encodeForHTMLContext('<h1>Testing & testing</h1> <p>"One quote", said the man</p>')
    ).toBe(
      '&lt;h1&gt;Testing &amp; testing&lt;/h1&gt; &lt;p&gt;&quot;One quote&quot;, said the man&lt;/p&gt;'
    );
  });
});
