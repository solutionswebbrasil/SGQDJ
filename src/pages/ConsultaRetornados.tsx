import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Pencil, Trash2, Check, X, DollarSign } from 'lucide-react';

type Retornado = {
  id: string;
  id_cliente: number;
  toner_id: string;
  peso_retornado: number;
  unidade_id: string;
  destino_final: 'Descarte' | 'Garantia' | 'Estoque' | 'Uso Interno';
  created_at: string;
  toner: {
    modelo: string;
    peso_cheio: number;
    peso_vazio: number;
    impressoras_compativeis: string;
    cor: 'Black' | 'Cyan' | 'Magenta' | 'Yellow';
    area_impressa_iso: number;
    capacidade_folhas: number;
    tipo: 'Compatível' | 'Original';
    preco_folha: number;
  };
  unidade: {
    unidade: string;
  };
};

type EditFormData = {
  id_cliente: number;
  peso_retornado: number;
  destino_final: 'Descarte' | 'Garantia' | 'Estoque' | 'Uso Interno';
};

function ConsultaRetornados() {
  const [retornados, setRetornados] = useState<Retornado[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRetornados();
  }, []);

  const fetchRetornados = async () => {
    const { data, error } = await supabase
      .from('retornados')
      .select(`
        *,
        toner:toner_id (
          modelo,
          peso_cheio,
          peso_vazio,
          impressoras_compativeis,
          cor,
          area_impressa_iso,
          capacidade_folhas,
          tipo,
          preco_folha
        ),
        unidade:unidade_id (
          unidade
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar retornados:', error);
      setError('Erro ao carregar os dados');
      return;
    }

    setRetornados(data || []);
  };

  const startEditing = (retornado: Retornado) => {
    setEditingId(retornado.id);
    setEditForm({
      id_cliente: retornado.id_cliente,
      peso_retornado: retornado.peso_retornado,
      destino_final: retornado.destino_final,
    });
    setError(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
    setError(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editForm) return;

    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === 'id_cliente' || name === 'peso_retornado' ? Number(value) : value,
    });
  };

  const saveEdit = async () => {
    if (!editingId || !editForm) return;

    try {
      const { error } = await supabase
        .from('retornados')
        .update({
          id_cliente: editForm.id_cliente,
          peso_retornado: editForm.peso_retornado,
          destino_final: editForm.destino_final,
        })
        .eq('id', editingId);

      if (error) throw error;

      await fetchRetornados();
      setEditingId(null);
      setEditForm(null);
      setError(null);
    } catch (error: any) {
      setError('Erro ao atualizar registro: ' + error.message);
    }
  };

  const deleteRetornado = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) return;

    try {
      const { error } = await supabase
        .from('retornados')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchRetornados();
      setError(null);
    } catch (error: any) {
      setError('Erro ao excluir registro: ' + error.message);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateRecoveredValue = (retornado: Retornado) => {
    if (retornado.destino_final === 'Estoque') {
      return retornado.toner.preco_folha * 10000;
    }
    return 0;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Consulta de Retornados</h2>
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">ID Cliente</th>
              <th className="px-4 py-3">Modelo</th>
              <th className="px-4 py-3">Peso Cheio</th>
              <th className="px-4 py-3">Impressoras</th>
              <th className="px-4 py-3">Cor</th>
              <th className="px-4 py-3">Área ISO</th>
              <th className="px-4 py-3">Capacidade</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Peso Retornado</th>
              <th className="px-4 py-3">Unidade</th>
              <th className="px-4 py-3">Destino</th>
              <th className="px-4 py-3">Valor Recuperado</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {retornados.map((retornado) => (
              <tr key={retornado.id} className="bg-white border-b hover:bg-gray-50">
                {editingId === retornado.id ? (
                  <>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        name="id_cliente"
                        value={editForm?.id_cliente || ''}
                        onChange={handleEditChange}
                        className="w-24 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-3">{retornado.toner.modelo}</td>
                    <td className="px-4 py-3">{retornado.toner.peso_cheio}g</td>
                    <td className="px-4 py-3">{retornado.toner.impressoras_compativeis}</td>
                    <td className="px-4 py-3">{retornado.toner.cor}</td>
                    <td className="px-4 py-3">{retornado.toner.area_impressa_iso * 100}%</td>
                    <td className="px-4 py-3">{retornado.toner.capacidade_folhas}</td>
                    <td className="px-4 py-3">{retornado.toner.tipo}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        name="peso_retornado"
                        value={editForm?.peso_retornado || ''}
                        onChange={handleEditChange}
                        className="w-24 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-3">{retornado.unidade.unidade}</td>
                    <td className="px-4 py-3">
                      <select
                        name="destino_final"
                        value={editForm?.destino_final || ''}
                        onChange={handleEditChange}
                        className="w-32 px-2 py-1 border rounded"
                      >
                        <option value="Descarte">Descarte</option>
                        <option value="Garantia">Garantia</option>
                        <option value="Estoque">Estoque</option>
                        <option value="Uso Interno">Uso Interno</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {editForm?.destino_final === 'Estoque' ? (
                        <div className="flex items-center text-green-600">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {formatCurrency(retornado.toner.preco_folha * 10000)}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3">{formatDate(retornado.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">{retornado.id_cliente}</td>
                    <td className="px-4 py-3">{retornado.toner.modelo}</td>
                    <td className="px-4 py-3">{retornado.toner.peso_cheio}g</td>
                    <td className="px-4 py-3">{retornado.toner.impressoras_compativeis}</td>
                    <td className="px-4 py-3">{retornado.toner.cor}</td>
                    <td className="px-4 py-3">{retornado.toner.area_impressa_iso * 100}%</td>
                    <td className="px-4 py-3">{retornado.toner.capacidade_folhas}</td>
                    <td className="px-4 py-3">{retornado.toner.tipo}</td>
                    <td className="px-4 py-3">{retornado.peso_retornado}g</td>
                    <td className="px-4 py-3">{retornado.unidade.unidade}</td>
                    <td className="px-4 py-3">{retornado.destino_final}</td>
                    <td className="px-4 py-3">
                      {retornado.destino_final === 'Estoque' ? (
                        <div className="flex items-center text-green-600">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {formatCurrency(calculateRecoveredValue(retornado))}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3">{formatDate(retornado.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(retornado)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteRetornado(retornado.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ConsultaRetornados;