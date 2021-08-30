import { safeParseJSON } from './safeParseJSON';

describe('parseJSON util', () => {
  it('returns JSON if string is correct', () => {
    const correctJSONString =
      '{"fio":{"title":"ФИО","filled":5},"phone_mobile":{"title":"Мобильный телефон","filled":15}}';
    const correctJSON = {
      fio: {
        title: 'ФИО',
        filled: 5,
      },
      phone_mobile: {
        title: 'Мобильный телефон',
        filled: 15,
      },
    };

    expect(safeParseJSON(correctJSONString)).toEqual(correctJSON);
  });

  it('returns null if string is not correct', () => {
    const notCorrectJSONString =
      "{fio:{title:'ФИО',filled:5},phone_mobile:{title:'Мобильный телефон',filled:15},}";

    expect(safeParseJSON(notCorrectJSONString)).toBeNull();
  });

  it('returns defaultValue if string is not correct', () => {
    const notCorrectJSONString =
      "{fio:{title:'ФИО',filled:5},phone_mobile:{title:'Мобильный телефон',filled:15},}";

    expect(safeParseJSON(notCorrectJSONString, 'wrong!!')).toBe('wrong!!');
  });
});
