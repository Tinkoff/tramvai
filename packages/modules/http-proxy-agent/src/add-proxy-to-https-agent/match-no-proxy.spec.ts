import { matchNoProxy } from './match-no-proxy';

describe('match-no-proxy', () => {
  it('empty noProxy not match any hosts', () => {
    const noProxy = '';

    expect(
      matchNoProxy({
        noProxy,
        hostname: 'test.com',
      })
    ).toBeFalsy();
  });

  it('wildcard noProxy match all hosts', () => {
    const noProxy = '*';

    expect(
      matchNoProxy({
        noProxy,
        hostname: 'test.com',
      })
    ).toBeTruthy();

    expect(
      matchNoProxy({
        noProxy,
        hostname: 'foo.bar.com',
      })
    ).toBeTruthy();
  });

  it('domain noProxy match domain and all subdomains', () => {
    const noProxy = 'test.com';

    // negative
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'another.com',
      })
    ).toBeFalsy();
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'api.another.com',
      })
    ).toBeFalsy();

    // positive
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'test.com',
      })
    ).toBeTruthy();
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'api.test.com',
      })
    ).toBeTruthy();
  });

  it('subdomain noProxy match only subdomain', () => {
    const noProxy = 'api.test.com';

    // negative
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'another.com',
      })
    ).toBeFalsy();
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'test.com',
      })
    ).toBeFalsy();
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'cdn.another.com',
      })
    ).toBeFalsy();
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'cdn.test.com',
      })
    ).toBeFalsy();
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'api.another.com',
      })
    ).toBeFalsy();

    // positive
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'api.test.com',
      })
    ).toBeTruthy();
  });

  it('ip address in noProxy', () => {
    const noProxy = '127.0.0.1';

    expect(
      matchNoProxy({
        noProxy,
        hostname: 'test.com',
      })
    ).toBeFalsy();
    expect(
      matchNoProxy({
        noProxy,
        hostname: '127.0.0.1',
      })
    ).toBeTruthy();
  });

  it('top level domain in noProxy', () => {
    const noProxy = 'localhost';

    expect(
      matchNoProxy({
        noProxy,
        hostname: 'test.com',
      })
    ).toBeFalsy();
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'localhost',
      })
    ).toBeTruthy();
  });

  it('strip leading dot from noProxy and match domain with subdomains', () => {
    const noProxy = '.test.com';

    // negative
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'another.com',
      })
    ).toBeFalsy();

    expect(
      matchNoProxy({
        noProxy,
        hostname: 'cdn.another.com',
      })
    ).toBeFalsy();
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'api.another.com',
      })
    ).toBeFalsy();

    // positive
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'test.com',
      })
    ).toBeTruthy();
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'cdn.test.com',
      })
    ).toBeTruthy();
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'api.test.com',
      })
    ).toBeTruthy();
  });

  it('strip leading dot with wildcard from noProxy and match domain with subdomains - for backward compatibility', () => {
    const noProxy = '*.test.com';

    // negative
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'another.com',
      })
    ).toBeFalsy();

    expect(
      matchNoProxy({
        noProxy,
        hostname: 'cdn.another.com',
      })
    ).toBeFalsy();
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'api.another.com',
      })
    ).toBeFalsy();

    // positive
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'test.com',
      })
    ).toBeTruthy();
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'cdn.test.com',
      })
    ).toBeTruthy();
    expect(
      matchNoProxy({
        noProxy,
        hostname: 'api.test.com',
      })
    ).toBeTruthy();
  });

  describe('comma-separated noProxy', () => {
    const noProxy = 'localhost,127.0.0.1,test.com,.foo.bar,sub.domain.org';

    it('domain noProxy match domain and all subdomains', () => {
      // negative
      expect(
        matchNoProxy({
          noProxy,
          hostname: 'another.com',
        })
      ).toBeFalsy();
      expect(
        matchNoProxy({
          noProxy,
          hostname: 'api.another.com',
        })
      ).toBeFalsy();

      // positive
      expect(
        matchNoProxy({
          noProxy,
          hostname: 'test.com',
        })
      ).toBeTruthy();
      expect(
        matchNoProxy({
          noProxy,
          hostname: 'api.test.com',
        })
      ).toBeTruthy();
    });

    it('subdomain noProxy match only subdomain', () => {
      // negative
      expect(
        matchNoProxy({
          noProxy,
          hostname: 'another.com',
        })
      ).toBeFalsy();
      expect(
        matchNoProxy({
          noProxy,
          hostname: 'domain.org',
        })
      ).toBeFalsy();
      expect(
        matchNoProxy({
          noProxy,
          hostname: 'cdn.another.com',
        })
      ).toBeFalsy();
      expect(
        matchNoProxy({
          noProxy,
          hostname: 'cdn.domain.org',
        })
      ).toBeFalsy();
      expect(
        matchNoProxy({
          noProxy,
          hostname: 'api.another.com',
        })
      ).toBeFalsy();

      // positive
      expect(
        matchNoProxy({
          noProxy,
          hostname: 'sub.domain.org',
        })
      ).toBeTruthy();
    });

    it('ip address in noProxy', () => {
      expect(
        matchNoProxy({
          noProxy,
          hostname: 'another.com',
        })
      ).toBeFalsy();
      expect(
        matchNoProxy({
          noProxy,
          hostname: '127.0.0.1',
        })
      ).toBeTruthy();
    });

    it('top level domain in noProxy', () => {
      expect(
        matchNoProxy({
          noProxy,
          hostname: 'another.com',
        })
      ).toBeFalsy();
      expect(
        matchNoProxy({
          noProxy,
          hostname: 'localhost',
        })
      ).toBeTruthy();
    });

    it('strip leading dot from noProxy and match domain with subdomains', () => {
      // negative
      expect(
        matchNoProxy({
          noProxy,
          hostname: 'another.com',
        })
      ).toBeFalsy();
      expect(
        matchNoProxy({
          noProxy,
          hostname: 'cdn.another.com',
        })
      ).toBeFalsy();
      expect(
        matchNoProxy({
          noProxy,
          hostname: 'api.another.com',
        })
      ).toBeFalsy();

      // positive
      expect(
        matchNoProxy({
          noProxy,
          hostname: 'foo.bar',
        })
      ).toBeTruthy();
      expect(
        matchNoProxy({
          noProxy,
          hostname: 'cdn.foo.bar',
        })
      ).toBeTruthy();
      expect(
        matchNoProxy({
          noProxy,
          hostname: 'api.foo.bar',
        })
      ).toBeTruthy();
    });
  });
});
