import fuzzy from 'fuzzy';

type QuestionWithAutoComplete = {
  message: string;
  name: string;
  choices: string[];
  suggestOnly?: boolean;
  source?: (answers, input: string) => Promise<string[]>;
  [key: string]: any;
};

export function withAutocomplete(prompt: QuestionWithAutoComplete) {
  return Object.assign(prompt, {
    source: (answers, input) => {
      return new Promise((resolve) => {
        if (!input) {
          return resolve(prompt.choices);
        }
        setTimeout(() => {
          resolve(
            fuzzy
              .filter(input, prompt.choices)
              .map((el) => el.original)
              .filter(Boolean)
          );
        });
      });
    },
    type: 'autocomplete',
  }) as any;
}
