import type { PageComponent } from '@tramvai/react';

export const FourthPage: PageComponent = () => {
  return (
    <div>
      {['better', 'late', 'than', 'never'].map((word) => (
        // @ts-ignore. Only for testing purpose
        <p key={word}>{word.nested.azaza}</p>
      ))}
    </div>
  );
};

export default FourthPage;
