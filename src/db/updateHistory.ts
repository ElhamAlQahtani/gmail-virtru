import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_TOKEN as string);

export default async (historyID: string): Promise<string | null> => {
  const { data, error } = await supabase.from('history').select().single();
  if (error || !data) {
    const { error } = await supabase.from('history').insert([{ history_id: historyID }]);

    if (error) {
      console.log(error)
      throw 'history not created';
    }
    return null;
  }
  await supabase.from('history').update({ history_id: historyID }).match({ id: data.id });
  return data.history_id;
};
