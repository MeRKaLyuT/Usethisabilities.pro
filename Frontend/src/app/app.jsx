import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from '../pages/homePage/ui/home';
import Header from '../widgets/header/ui/header';
import {StarfieldBackground} from '../widgets/starfieldBackground/index';


const App = () => {
    return (
        <>
        <StarfieldBackground />
        <Router basename="/">
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
        </>
    );
};

export default App;

// function r(min, max) {
//     return Math.floor(Math.random() * (max - min) + min);
// }

// const App = () => {
//     const radius = r(5,10);
//     return(
//         console.log(radius)
//     );
// }

// export default App;
