import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "../Pages/HomePage"
import "../Styles/global.css"
import { WhatsAppProvider } from "../Context/WhatsappContext"
import ContactInfoPage from "../Pages/ContactInfoPage"
import MessagePage from "../Pages/MessagePage"



export default function WhatsAppRouter() {
    return (
        <WhatsAppProvider>
            <Router>
                <div className="whatsapp-app">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/message/:id" element={<MessagePage />} />
                        <Route path="/contactInfo/:id" element={<ContactInfoPage />} />
                    </Routes>
                </div>
            </Router>
        </WhatsAppProvider>
    )
}
