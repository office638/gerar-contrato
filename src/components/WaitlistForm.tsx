import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const session = await supabase.auth.getSession();
    const uid = session?.data?.session?.user?.id;

    const insertData = {
      email,
      ...(uid ? { user_id: uid } : {})
    };

    const { error } = await supabase.from('waitlist').insert([insertData]);

    setLoading(false);

    if (error) {
      console.error('Erro ao salvar:', error.message);
      alert('Erro ao salvar. Tente novamente mais tarde.');
    } else {
      alert('Recebemos seu interesse! Em breve entraremos em contato.');
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold text-center">Lista de Espera</h2>
      <input
        type="email"
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 rounded w-full"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Enviando...' : 'Entrar em contato'}
      </button>
    </form>
  );
}
