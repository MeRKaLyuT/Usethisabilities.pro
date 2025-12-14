import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import Header from '../widgets/header/ui/header';
import Header from '../widgets/header2/header';
import {StarfieldBackground} from '../widgets/starfieldBackground/index';
import {Home} from '../pages/homePage/index.js';
import { Profile } from '../pages/profilePage/index.js';


const App = () => {
    return (
        <>
        <StarfieldBackground />
        <Header />
        {/* <Router basename="/">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router> */}
        </>
    );
};

export default App;
