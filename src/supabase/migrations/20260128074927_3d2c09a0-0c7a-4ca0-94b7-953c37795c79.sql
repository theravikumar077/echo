-- Create groups table for location-based chat rooms
CREATE TABLE public.groups (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    radius_km DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    anonymous_name TEXT NOT NULL,
    anonymous_icon TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Groups policies
CREATE POLICY "Anyone can view active groups"
ON public.groups FOR SELECT
USING (is_active = true);

CREATE POLICY "Authenticated users can create groups"
ON public.groups FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their groups"
ON public.groups FOR UPDATE
TO authenticated
USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their groups"
ON public.groups FOR DELETE
TO authenticated
USING (auth.uid() = creator_id);

-- Messages policies (public read/write for anonymous chat)
CREATE POLICY "Anyone can view messages in active groups"
ON public.messages FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.groups 
    WHERE groups.id = messages.group_id 
    AND groups.is_active = true
));

CREATE POLICY "Anyone can send messages to active groups"
ON public.messages FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.groups 
    WHERE groups.id = messages.group_id 
    AND groups.is_active = true
));

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.groups;