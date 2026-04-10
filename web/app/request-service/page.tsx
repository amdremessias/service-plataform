import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const RequestServicePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const displacementFee = 100; // R$100 de taxa de deslocamento

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!user) {
      setError('Você precisa estar logado para solicitar um serviço.');
      setLoading(false);
      return;
    }

    try {
      // 1. Processar a taxa de deslocamento
      const paymentResponse = await api.post('/payments/process', {
        amount: displacementFee,
        paymentMethod: 'credit_card', // Exemplo, em um app real seria dinâmico
      });

      if (paymentResponse.data.message !== 'Payment processed successfully') {
        throw new Error('Falha ao processar a taxa de deslocamento.');
      }

      // 2. Criar a solicitação de serviço (placeholder)
      // Em um cenário real, você enviaria os detalhes do serviço para o backend
      // e o backend associaria ao usuário e à taxa de deslocamento paga.
      console.log('Taxa de deslocamento paga com sucesso. Detalhes do serviço:', {
        serviceType,
        description,
        userId: user.id,
        paymentTransactionId: paymentResponse.data.result.transactionId,
      });

      alert(`Serviço de ${serviceType} solicitado! Taxa de deslocamento de R$${displacementFee} paga.`);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao solicitar o serviço.');
      console.error('Erro ao solicitar serviço:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">Solicitar Serviço</h1>
        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="serviceType" className="mb-2 block text-sm font-medium text-gray-700">
              Tipo de Serviço
            </label>
            <input
              type="text"
              id="serviceType"
              name="serviceType"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Ex: Eletricista, Encanador, Diarista"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
              Descrição do Serviço
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Descreva o serviço que você precisa..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-lg font-semibold text-blue-800">Taxa de Deslocamento: R${displacementFee.toFixed(2)}</p>
            <p className="text-sm text-blue-700">Esta taxa é cobrada antecipadamente para cobrir custos de deslocamento do prestador.</p>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Processando...' : `Pagar R$${displacementFee.toFixed(2)} e Solicitar Serviço`}
          </button>
        </form>
      </div>
    </main>
  );
};

export default RequestServicePage;
