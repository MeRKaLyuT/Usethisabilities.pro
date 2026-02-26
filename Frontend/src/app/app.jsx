import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import Header from '../widgets/header/ui/header';
import Header from '../widgets/header2/header';
import { Home2 } from '../pages/homePage2/index.js';
import { Profile2 } from '../pages/profilePage2/index.js';
import { Abilities2 } from '../pages/abilitiesPage2/index.js';
import { Roadmaps2 } from '../pages/roadmaps2/index.js';
import { MyAbilities2 } from '../pages/myAbilities2/index.js';
import { CreateLesson2 } from '../pages/createLesson2/index.js';
import { AbilityView2 } from '../pages/abilityView2/index.js';
import { StarfieldBackground } from '../widgets/starfieldBackground/index.js';


const App = () => {
    return (
        <>
        <StarfieldBackground />
        <Header />
        <Router basename="/">
            <Routes>
                <Route path="/" element={<Home2 />} />
                <Route path="/profile" element={<Profile2 />} />
                <Route path="/abilities" element={<Abilities2 />} />
                <Route path="/abilities/my/" element={<MyAbilities2 />} />
                <Route path="/abilities/my/create" element={<CreateLesson2 />} />
                <Route path="/abilities/:abilityId" element={<AbilityView2 />} />
                <Route path="/roadmaps" element={<Roadmaps2 />} />
            </Routes>
        </Router>
        </>
    );
};

export default App;
