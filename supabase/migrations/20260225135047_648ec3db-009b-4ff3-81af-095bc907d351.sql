
-- Projects table
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  location text,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed')),
  progress integer NOT NULL DEFAULT 0,
  start_date date,
  type text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Ponude (quotes) table
CREATE TABLE public.ponude (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  code text NOT NULL,
  title text NOT NULL,
  amount numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ponude ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ponude" ON public.ponude
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own ponude" ON public.ponude
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Racuni (invoices) table
CREATE TABLE public.racuni (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  code text NOT NULL,
  title text NOT NULL,
  amount numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue')),
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.racuni ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own racuni" ON public.racuni
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own racuni" ON public.racuni
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Poruke (messages) table
CREATE TABLE public.poruke (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name text NOT NULL DEFAULT '',
  text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.poruke ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own poruke" ON public.poruke
  FOR SELECT TO authenticated USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send poruke" ON public.poruke
  FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());

-- Conversations table
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations" ON public.conversations
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Activity log
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  icon_name text NOT NULL DEFAULT 'activity',
  title text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity" ON public.activity_log
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own activity" ON public.activity_log
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Enable realtime for poruke
ALTER PUBLICATION supabase_realtime ADD TABLE public.poruke;
