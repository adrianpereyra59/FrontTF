import React from "react"
import { useWhatsApp } from "../Context/WhatsappContext"
import Header from "../Component/Common/Header"
import SearchBar from "../Component/Common/SearchBar"
import TabNavigation from "../Component/Common/TabNavigation"
import ChatsList from "../Component/Chat/ChatList"
import EmptyState from "../Component/Common/EmptyState"

export default function HomePage() {
    const { activeTab } = useWhatsApp()

    const renderContent = () => {
        switch (activeTab) {
            case "chats":
                return <ChatsList />
            case "novedades":
                return <EmptyState icon="📰" title="Novedades" description="Mantente al día con las actualizaciones" />
            case "comunidades":
                return <EmptyState icon="👥" title="Comunidades" description="Conéctate con grupos similares" />
            case "llamadas":
                return <EmptyState icon="📞" title="Llamadas" description="Historial de llamadas recientes" />
            default:
                return <ChatsList />
        }
    }

    return (
        <div className="whatsapp-home">
            <Header />
            <SearchBar />
            <main className="main-content">{renderContent()}</main>
            <TabNavigation />
        </div>
    )
}
