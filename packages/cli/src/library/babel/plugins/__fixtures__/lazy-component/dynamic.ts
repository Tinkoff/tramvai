import { lazy } from '@tramvai/react';

lazy((props) => import(`./inner/${props.name}.js`))
