import { registerPrompt } from 'inquirer';
import promptAutocomplete from 'inquirer-autocomplete-prompt';

registerPrompt('autocomplete', promptAutocomplete);
