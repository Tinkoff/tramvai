import { lazy } from '@tramvai/react';

// @TODO: this test is not working properly on swc
// as there is no react-refresh plugin
// after enabling react-refresh update the snapshot
// and compare with original babel plugin snapshot

const MainPage = lazy(() => import('./inner/first'));
