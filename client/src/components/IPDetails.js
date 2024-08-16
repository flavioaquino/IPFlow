import React, { useEffect, useState, useCallback } from 'react';
import './css/IPs.css';
import axios from 'axios';
import ConfirmationPopup from './ConfirmationPopup';

function IPDetails({ closePopup, ipId }) {
    const [ipDetails, setIpDetails] = useState(null);
    const [originalIpDetails, setOriginalIpDetails] = useState(null); // Armazenar dados originais
    const [loading, setLoading] = useState(true);
    const [isClosing, setIsClosing] = useState(false);
    const [hasChanges, setHasChanges] = useState(false); // Novo estado para verificar alterações
    const [showConfirm, setShowConfirm] = useState(false); // Estado para controle do popup de confirmação

    useEffect(() => {
        const fetchIpDetails = async () => {
            try {
                const response = await axios.get(`/api/ips/${ipId}`);
                setIpDetails(response.data);
                setOriginalIpDetails(response.data); // Armazenar dados originais
            } catch (error) {
                console.error('Erro ao buscar detalhes do IP:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIpDetails();
    }, [ipId]);

    const handleClose = useCallback(() => {
        if (hasChanges) {
            setShowConfirm(true);
        } else {
            setIsClosing(true);
            setTimeout(() => {
                closePopup();
            }, 400); // Sincronize com a duração da animação
        }
    }, [hasChanges, closePopup]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (event.target.classList.contains('popup-overlay')) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [handleClose]);

    const handleUpdate = async () => {
        try {
            await axios.put(`/api/ips/${ipId}`, ipDetails);
            setOriginalIpDetails(ipDetails); // Atualizar dados originais após a atualização
            setHasChanges(false); // Resetar o estado de alterações
        } catch (error) {
            console.error('Erro ao atualizar IP:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setIpDetails((prevDetails) => {
            const updatedDetails = { ...prevDetails, [name]: value };
            setHasChanges(JSON.stringify(updatedDetails) !== JSON.stringify(originalIpDetails));
            return updatedDetails;
        });
    };

    const handleConfirmClose = () => {
        setShowConfirm(false);
        setIsClosing(true);
        setTimeout(() => {
            closePopup();
        }, 400); // Sincronize com a duração da animação
    };

    const handleCancelClose = () => {
        setShowConfirm(false);
    };

    if (loading) return <div></div>;

    return (
        <>
            <div className={`popup-overlay ${isClosing ? 'closing' : 'active'}`}>
                <div className="popup-content">
                    <button className="close-btn" onClick={handleClose}>×</button>
                    <h2>Detalhes do IP</h2>
                    <p><strong>Nome:</strong></p>
                    <input
                        type="text"
                        name="name"
                        value={ipDetails.name}
                        onChange={handleChange}
                    />
                    <p><strong>IP:</strong></p>
                    <input
                        type="text"
                        name="address"
                        value={ipDetails.address}
                        onChange={handleChange}
                    />
                    <p><strong>Descrição:</strong></p>
                    <input
                        type="text"
                        name="description"
                        value={ipDetails.description}
                        onChange={handleChange}
                    />
                    <p><strong>Última Visita:</strong> {ipDetails.last_seen ? ipDetails.last_seen : 'Nunca'}</p>
                    <p><strong>Criado em:</strong> {ipDetails.created_at}</p>
                    {hasChanges && (
                        <button onClick={handleUpdate} type="submit">Atualizar IP</button>
                    )}
                </div>
            </div>
            {showConfirm && (
                <ConfirmationPopup onConfirm={handleConfirmClose} onCancel={handleCancelClose} />
            )}
        </>
    );
}

export default IPDetails;
