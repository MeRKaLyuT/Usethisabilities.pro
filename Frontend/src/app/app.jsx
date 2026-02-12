import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import Header from '../widgets/header/ui/header';
import Header from '../widgets/header2/header';
import {StarfieldBackground} from '../widgets/starfieldBackground/index';
import {Home} from '../pages/homePage/index.js';
import { Home2 } from '../pages/homePage2/index.js';
import { Profile } from '../pages/profilePage/index.js';
import { Profile2 } from '../pages/profilePage2/index.js';
import { Abilities2 } from '../pages/abilitiesPage2/index.js';
import { Roadmaps2 } from '../pages/roadmaps2/index.js';
import { CourseDetailPage } from '../pages/course2/index.js';


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
                <Route path="/roadmaps" element={<Roadmaps2 />} />
                <Route path="/abilities/:slug" element={<CourseDetailPage />} />
            </Routes>
        </Router>
        </>
    );
};

export default App;
