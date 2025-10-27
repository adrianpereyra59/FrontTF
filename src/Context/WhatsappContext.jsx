import React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

const WhatsAppContext = createContext()

// Datos iniciales
const initialContacts = [
    {
        id: 1,
        name: "María García",
        phone: "+34 612 345 678",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        status: "en línea",
        lastSeen: "en línea",
        about: "Disponible",
        isOnline: true,
    },
    {
        id: 2,
        name: "Juan Pérez",
        phone: "+34 687 654 321",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        status: "última vez hoy a las 09:45",
        lastSeen: "última vez hoy a las 09:45",
        about: "Ocupado trabajando",
        isOnline: false,
    },
    {
        id: 3,
        name: "Familia 👨‍👩‍👧‍👦",
        phone: "Grupo",
        avatar: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=100&h=100&fit=crop&crop=face",
        status: "en línea",
        lastSeen: "en línea",
        about: "Grupo familiar",
        isOnline: true,
    },
    {
        id: 4,
        name: "Ana López",
        phone: "+34 654 987 123",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        status: "última vez ayer a las 16:20",
        lastSeen: "última vez ayer a las 16:20",
        about: "¡Hola! Estoy usando WhatsApp",
        isOnline: false,
    },
    {
        id: 5,
        name: "Trabajo - Equipo",
        phone: "Grupo",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
        status: "última vez ayer a las 15:00",
        lastSeen: "última vez ayer a las 15:00",
        about: "Grupo de trabajo",
        isOnline: false,
    },
    {
        id: 6,
        name: "Pedro Martínez",
        phone: "+34 698 741 852",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        status: "última vez el lunes a las 20:15",
        lastSeen: "última vez el lunes a las 20:15",
        about: "Amante del fútbol ⚽",
        isOnline: false,
    },
]

const initialMessages = {
    1: [
        { id: 1, text: "Hola, ¿cómo estás?", sender: "contact", time: "10:30", date: "Hoy" },
        { id: 2, text: "¡Hola! Todo bien, ¿y tú?", sender: "me", time: "10:32", date: "Hoy" },
        { id: 3, text: "Muy bien también, gracias por preguntar", sender: "contact", time: "10:33", date: "Hoy" },
    ],
    2: [
        { id: 1, text: "¿Vamos al cine esta noche?", sender: "contact", time: "09:45", date: "Hoy" },
        { id: 2, text: "¡Claro! ¿Qué película quieres ver?", sender: "me", time: "09:47", date: "Hoy" },
    ],
    3: [
        { id: 1, text: "No olviden la cena de mañana", sender: "contact", time: "08:20", date: "Hoy" },
        { id: 2, text: "¿A qué hora es?", sender: "me", time: "08:25", date: "Hoy" },
        { id: 3, text: "A las 7pm", sender: "contact", time: "08:26", date: "Hoy" },
        { id: 4, text: "Perfecto, ahí estaremos", sender: "me", time: "08:27", date: "Hoy" },
        { id: 5, text: "¿Llevamos algo?", sender: "me", time: "08:28", date: "Hoy" },
    ],
    4: [{ id: 1, text: "Gracias por tu ayuda 😊", sender: "contact", time: "16:20", date: "Ayer" }],
    5: [{ id: 1, text: "La reunión es a las 3pm", sender: "contact", time: "15:00", date: "Ayer" }],
    6: [{ id: 1, text: "¿Has visto el partido?", sender: "contact", time: "20:15", date: "Lun" }],
}

const initialState = {
    contacts: initialContacts,
    messages: initialMessages,
    activeTab: "chats",
    searchTerm: "",
    currentUser: {
        id: "me",
        name: "Yo",
        phone: "+34 600 000 000",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
    },
}

function whatsappReducer(state, action) {
    switch (action.type) {
        case "SET_ACTIVE_TAB":
            return { ...state, activeTab: action.payload }

        case "SET_SEARCH_TERM":
            return { ...state, searchTerm: action.payload }

        case "ADD_MESSAGE":
            const { contactId, message } = action.payload
            return {
                ...state,
                messages: {
                    ...state.messages,
                    [contactId]: [...(state.messages[contactId] || []), message],
                },
            }

        case "UPDATE_CONTACT_STATUS":
            return {
                ...state,
                contacts: state.contacts.map((contact) =>
                    contact.id === action.payload.id ? { ...contact, ...action.payload.updates } : contact,
                ),
            }

        case "MARK_MESSAGES_READ":
            // Aquí podrías implementar lógica para marcar mensajes como leídos
            return state

        default:
            return state
    }
}

export function WhatsAppProvider({ children }) {
    const [state, dispatch] = useReducer(whatsappReducer, initialState)

    // Cargar datos del localStorage al iniciar
    useEffect(() => {
        const savedMessages = localStorage.getItem("whatsapp-messages")
        if (savedMessages) {
            try {
                const parsedMessages = JSON.parse(savedMessages)
                // Aquí podrías dispatch una acción para cargar los mensajes guardados
            } catch (error) {
                console.error("Error loading saved messages:", error)
            }
        }
    }, [])

    // Guardar mensajes en localStorage cuando cambien
    useEffect(() => {
        localStorage.setItem("whatsapp-messages", JSON.stringify(state.messages))
    }, [state.messages])

    const addMessage = (contactId, text) => {
        const newMessage = {
            id: Date.now(),
            text,
            sender: "me",
            time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
            date: "Hoy",
        }

        dispatch({
            type: "ADD_MESSAGE",
            payload: { contactId, message: newMessage },
        })

        // Simular respuesta automática
        setTimeout(
            () => {
                const responses = [
                    "¡Genial!",
                    "Perfecto 👍",
                    "Entendido",
                    "¡Gracias!",
                    "De acuerdo",
                    "¡Excelente!",
                    "👌",
                    "¡Perfecto!",
                    "Sí, claro",
                    "¡Por supuesto!",
                ]
                const randomResponse = responses[Math.floor(Math.random() * responses.length)]

                const responseMessage = {
                    id: Date.now() + 1,
                    text: randomResponse,
                    sender: "contact",
                    time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
                    date: "Hoy",
                }

                dispatch({
                    type: "ADD_MESSAGE",
                    payload: { contactId, message: responseMessage },
                })
            },
            1500 + Math.random() * 2000,
        ) // Respuesta entre 1.5 y 3.5 segundos
    }

    const getContact = (id) => {
        return state.contacts.find((contact) => contact.id === Number.parseInt(id))
    }

    const getMessages = (contactId) => {
        return state.messages[contactId] || []
    }

    const getLastMessage = (contactId) => {
        const messages = state.messages[contactId] || []
        return messages[messages.length - 1]
    }

    const getUnreadCount = (contactId) => {
        // Simulación simple de mensajes no leídos
        const messages = state.messages[contactId] || []
        return messages.filter((msg) => msg.sender === "contact" && !msg.read).length
    }

    const filteredContacts = state.contacts.filter((contact) =>
        contact.name.toLowerCase().includes(state.searchTerm.toLowerCase()),
    )

    const value = {
        ...state,
        dispatch,
        addMessage,
        getContact,
        getMessages,
        getLastMessage,
        getUnreadCount,
        filteredContacts,
    }

    return <WhatsAppContext.Provider value={value}>{children}</WhatsAppContext.Provider>
}

export function useWhatsApp() {
    const context = useContext(WhatsAppContext)
    if (!context) {
        throw new Error("useWhatsApp must be used within a WhatsAppProvider")
    }
    return context
}
