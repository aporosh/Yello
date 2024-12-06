import React from "react";
import { Routes, Route } from "react-router-dom";
import { ROUTES } from "../../utils/routes";
import HomePage from "../../pages/HomePage/HomePage";
import ResultPage from "../../pages/ResultPage/ResultPage";
import AdminPage from "../../pages/AdminPage/AdminPage";
import ChallengersPage from "../../pages/ChallengersPage/ChallengersPage";



const AppRoutes = () => (
    <Routes >
        <Route path={ROUTES.CHALLENGE} element={<HomePage />} />
        <Route path={ROUTES.RESULTS} element={<ResultPage />} />
        <Route path={ROUTES.ADMIN} element={<AdminPage />} />
        <Route path={ROUTES.CHALLENGERS} element={<ChallengersPage />} />
    </Routes>
);

export default AppRoutes;