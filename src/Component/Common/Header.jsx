import React from "react"
import { Camera, MoreVertical } from "lucide-react"

export default function Header() {
    return (
        <header className="whatsapp-header">
            <h1>WhatsApp</h1>
            <div className="header-icons">
                <button className="icon-button" aria-label="Cámara">
                    <Camera size={20} />
                </button>
                <button className="icon-button" aria-label="Más opciones">
                    <MoreVertical size={20} />
                </button>
            </div>
        </header>
    )
}
