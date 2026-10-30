import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PhotoGallery from '@/components/PhotoGallery';
import EmptyState from '@/components/EmptyState';
import PageSkeleton from '@/components/skeletons/PageSkeleton';
import Logo from '@/components/Logo';
import type { ProjectPhase } from '@/lib/projects';
export default function ShareGallery(){
 const {token}=useParams();const [data,setData]=useState<{project:{id:string;title:string};phases:ProjectPhase[]}|null>(null),[loading,setLoading]=useState(true);
 useEffect(()=>{let live=true;setLoading(true);setData(null);(async()=>{if(!token||!/^[a-f0-9]{32}$/.test(token)){if(live)setLoading(false);return;}const {data,error}=await supabase.functions.invoke('shared-project-gallery',{body:{token}});if(live){if(!error&&data?.project)setData(data);setLoading(false);}})();return()=>{live=false;};},[token]);
 if(loading)return <PageSkeleton/>;
 return <main className="min-h-screen bg-dash-bg text-dash-ink font-dashboard px-5 py-10 md:p-12"><div className="max-w-6xl mx-auto">{!data||!token?<EmptyState icon={ImageIcon} title="Link nije valjan ili je istekao"/>:<><header className="mb-10 border-b border-dash-border pb-8"><div className="flex items-center gap-3 mb-6"><Logo size={40}/><span className="font-serif text-xl">brick.hr</span></div><h1 className="font-serif text-3xl md:text-4xl break-words">Napredak projekta: {data.project.title}</h1><p className="mt-3 text-sm text-dash-muted">Dijeli: Brick — brick.hr</p></header><PhotoGallery projectId={data.project.id} phases={data.phases} canUpload={false} canDelete={false} canShare={false} canDownloadZip={false} shareToken={token}/></>}</div></main>;
}
