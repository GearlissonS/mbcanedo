import React, { useState, useEffect } from 'react';
import './KanbanVendas.css';

// Dummy API fetch function (replace with real API)
const fetchSales = async () => {
  // Simulate API response
  return [
    {
      id: 1,
      cliente: 'João Silva',
      imovel: 'Apto 101',
      corretor: 'Maria Souza',
      valor: 350000,
      etapa: 'Aprovação',
      dataEntrada: '2025-08-01',
      status: 'Aprovado',
      contato: {
        whatsapp: '5511999999999',
        telefone: '11999999999',
        email: 'joao@email.com',
      },
    },
    // ...more cards
  ];
};

const etapas = [
  'Aprovação',
  'Aguardando Contrato',
  'Contrato Assinado',
  'Aguardando Reserva',
  'Contrato Banco Assinado',
  'Aguardando Conformidade',
  'Finalizado',
  'Distrato',
];

const KanbanVendas = () => {
  const [cards, setCards] = useState([]);
  const [filtroCorretor, setFiltroCorretor] = useState('');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    fetchSales().then(setCards);
  }, []);

  // Drag & Drop logic
  const onDragStart = (e, cardId) => {
    e.dataTransfer.setData('cardId', cardId);
  };

  const onDrop = (e, etapa) => {
    const cardId = e.dataTransfer.getData('cardId');
    setCards(prev => prev.map(card =>
      card.id === Number(cardId) ? { ...card, etapa } : card
    ));
    // TODO: Save to API
  };

  // Filtered and searched cards
  const filteredCards = cards.filter(card =>
    (!filtroCorretor || card.corretor === filtroCorretor) &&
    (card.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      card.imovel.toLowerCase().includes(busca.toLowerCase()))
  );

  // Add new card
  const addCard = () => {
    // TODO: Modal or form for new card
    alert('Adicionar nova venda (implementar modal/form)');
  };

  return (
    <div className="kanban-vendas-container">
      <div className="kanban-header">
        <input
          type="text"
          placeholder="Buscar por cliente ou imóvel"
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        <select value={filtroCorretor} onChange={e => setFiltroCorretor(e.target.value)}>
          <option value="">Todos Corretores</option>
          {[...new Set(cards.map(c => c.corretor))].map(corretor => (
            <option key={corretor} value={corretor}>{corretor}</option>
          ))}
        </select>
        <button className="nova-venda-btn" onClick={addCard}>+ Nova Venda</button>
      </div>
      <div className="kanban-board">
        {etapas.map(etapa => {
          const etapaCards = filteredCards.filter(card => card.etapa === etapa);
          const valorTotal = etapaCards.reduce((sum, c) => sum + c.valor, 0);
          return (
            <div
              key={etapa}
              className={`kanban-column kanban-${etapa.replace(/\s/g, '-').toLowerCase()}`}
              onDragOver={e => e.preventDefault()}
              onDrop={e => onDrop(e, etapa)}
            >
              <div className="kanban-column-header">
                <span>{etapa}</span>
                <span className="kanban-count">{etapaCards.length} vendas</span>
                <span className="kanban-total">R$ {valorTotal.toLocaleString()}</span>
              </div>
              <div className="kanban-cards">
                {etapaCards.map(card => (
                  <div
                    key={card.id}
                    className="kanban-card"
                    draggable
                    onDragStart={e => onDragStart(e, card.id)}
                  >
                    <div className="kanban-card-header">
                      <span className={`badge badge-${card.status === 'Aprovado' ? 'green' : 'red'}`}>{card.status}</span>
                      <span className="kanban-card-date">{card.dataEntrada}</span>
                    </div>
                    <div className="kanban-card-body">
                      <div><strong>Cliente:</strong> {card.cliente}</div>
                      <div><strong>Imóvel:</strong> {card.imovel}</div>
                      <div><strong>Corretor:</strong> {card.corretor}</div>
                      <div><strong>Valor:</strong> R$ {card.valor.toLocaleString()}</div>
                    </div>
                    <div className="kanban-card-footer">
                      <a href={`https://wa.me/${card.contato.whatsapp}`} target="_blank" rel="noopener noreferrer" title="WhatsApp">
                        <i className="icon-whatsapp" />
                      </a>
                      <a href={`tel:${card.contato.telefone}`} title="Telefone">
                        <i className="icon-phone" />
                      </a>
                      <a href={`mailto:${card.contato.email}`} title="E-mail">
                        <i className="icon-mail" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanVendas;
