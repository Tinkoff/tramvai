// это мок реализации от packages/modules/authenticate/src/shared/actionConditions/authCondition.ts
import shallowEqual from '@tinkoff/utils/is/shallowEqual';
import type { ActionConditionChecker } from '@tramvai/tokens-common';

function hasAccess(a: any, b: string) {
  return !!a.CORE[b];
}

const saveState = ({
  guid,
  accessLevel,
  campaign,
}: {
  guid: string;
  accessLevel: string;
  campaign: { id: string };
}) => ({
  guid,
  accessLevel,
  campaignId: campaign?.id,
});

export const authConditionFactory = ({ context }: any): any => ({
  key: 'auth',
  fn: (checker: ActionConditionChecker) => {
    const { requiredCoreRoles, requiredRoles = requiredCoreRoles } = checker.conditions;

    if (requiredRoles) {
      const { roles, session } = context.getState();

      if (!hasAccess(roles, requiredRoles[0])) {
        return checker.forbid();
      }

      const newState = saveState(session);

      if (!shallowEqual(checker.getState(), newState)) {
        checker.allow();
        checker.setState(newState);
      }
    }
  },
});
