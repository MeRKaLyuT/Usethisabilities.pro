import React, {lazy, Suspense} from 'react';

const LazyStarField = lazy(() => import('./ui/starfieldBackground'));

export const StarfieldBackgroundAsync = () => (
    <Suspense fallback={null}> {/* React requires the Suspence in lazy features.
        It says it will be shown until all children are loaded */}
        <LazyStarField />
    </Suspense>
);
